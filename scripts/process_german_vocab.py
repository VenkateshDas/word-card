import csv
import json
import os
import time
import openai
import logging
import asyncio # Import asyncio for async operations
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set your OpenAI API key here or use an environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

INPUT_CSV = os.path.join(os.path.dirname(__file__), '../data/German_A1_Vocab_Categorized_With_Sentences_v2.csv')
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), '../data/German_A1_Vocab_Processed.json')
OUTPUT_CSV_REVIEW = os.path.join(os.path.dirname(__file__), '../data/German_A1_Vocab_For_Review.csv')
BATCH_SIZE = 15
MODEL = "gpt-4.1-mini"

# Helper to read the CSV
def read_vocab_csv(path: str) -> List[Dict]:
    logging.info(f"Reading vocabulary data from {path}...")
    with open(path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = [row for row in reader]
    logging.info(f"Finished reading {len(rows)} words from CSV.")
    return rows

def batchify(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

# Utility to make sure we can safely join nested or non‑string lists returned by the model
def flatten_to_str_list(lst):
    """
    Recursively flattens a possibly‑nested list and converts every element to
    a string so that it can be joined or written to CSV without errors.
    """
    for item in lst:
        if isinstance(item, list):
            yield from flatten_to_str_list(item)
        else:
            yield str(item)

def build_prompt(batch):
    # Prepare the prompt for the batch
    words_json = [
        {
            "Category": w["Category"],
            "German": w["German"],
            "Article": w["Article"],
            "English": w["English"],
            "ExampleGerman": w["Example (DE)"]
        }
        for w in batch
    ]
    prompt = (
        "You are a language assistant. For each of the following German words, do the following:\n"
        "- Identify the figure of speech (noun, verb, adjective, etc.)\n"
        "- Generate 3 example sentences in German (use the provided one if available, and create 2 more)\n"
        "- Provide English translations for each sentence\n\n"
        "Return the result as a JSON array, one object per word, with these fields:\n"
        "- 'Category'\n- 'German'\n- 'Article'\n- 'English'\n- 'FigureOfSpeech'\n- 'ExamplesGerman': [sentence1, sentence2, sentence3]\n- 'ExamplesEnglish': [translation1, translation2, translation3]\n\n"
        "Here are the words:\n"
        f"{json.dumps(words_json, ensure_ascii=False, indent=2)}"
    )
    return prompt

# Make the API call function asynchronous
async def call_openai_api(prompt: str, max_retries=3):
    for attempt in range(max_retries):
        try:
            client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = await client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.7,
                max_tokens=2048
            )
            content = response.choices[0].message.content
            if content is None:
                raise RuntimeError("OpenAI API returned no content in the response.")
            return json.loads(content)
        except Exception as e:
            logging.warning(f"OpenAI API error on attempt {attempt + 1}/{max_retries}: {e}. Retrying in 10s...")
            await asyncio.sleep(10) # Use async sleep
    logging.error("OpenAI API failed after multiple retries.")
    raise RuntimeError("OpenAI API failed after retries.")

async def main(): # Make main function asynchronous
    vocab = read_vocab_csv(INPUT_CSV)
    total_words = len(vocab)
    processed_words = 0
    results = []

    batches = list(batchify(vocab, BATCH_SIZE))
    total_batches = len(batches)

    logging.info(f"Starting processing of {total_words} words in {total_batches} batches...")

    tasks = []
    for i, batch in enumerate(batches):
        prompt = build_prompt(batch)
        logging.info(f"Adding batch {i + 1}/{total_batches} to processing queue...")
        tasks.append(call_openai_api(prompt))

    # Run all API calls concurrently
    # Use a semaphore to limit concurrent requests if needed for rate limits
    # For now, let's keep it simple and assume the OpenAI library handles some of it.
    processed_batches_results = await asyncio.gather(*tasks, return_exceptions=True)

    for i, batch_result in enumerate(processed_batches_results):
        batch = batches[i] # Get the original batch for logging clarity
        if isinstance(batch_result, Exception):
            logging.error(f"Failed to process batch {i + 1}: {batch_result}")
        else:
            # Normalise different response shapes returned by the OpenAI API
            if isinstance(batch_result, dict):
                if 'result' in batch_result:
                    batch_result = batch_result['result']
                elif 'results' in batch_result:   # some responses use the plural key
                    batch_result = batch_result['results']

            # Ensure batch_result is a list before extending
            if isinstance(batch_result, list):
                results.extend(batch_result)
                processed_words += len(batch)
                logging.info(f"Successfully processed batch {i + 1}. Total words processed: {processed_words}/{total_words}.")
            else:
                logging.error(f"Unexpected API response format for batch {i + 1}: {type(batch_result).__name__} received instead of list. Content: {batch_result}")

    # No need for time.sleep(2) between batches now as they run in parallel

    # Save results to a review CSV file
    if results:
        csv_fieldnames = [
            "Category", "German", "Article", "English", "FigureOfSpeech",
            "ExamplesGerman", "ExamplesEnglish"
        ]
        with open(OUTPUT_CSV_REVIEW, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_fieldnames)
            writer.writeheader()
            for entry in results:
                # Convert lists to string for CSV output
                entry_copy = entry.copy() # Avoid modifying the original dict in results list
                entry_copy["ExamplesGerman"] = '; '.join(flatten_to_str_list(entry_copy.get("ExamplesGerman", [])))
                entry_copy["ExamplesEnglish"] = '; '.join(flatten_to_str_list(entry_copy.get("ExamplesEnglish", [])))
                writer.writerow(entry_copy)
        logging.info(f"Done! Output for review written to {OUTPUT_CSV_REVIEW}")

    # Transform to new format
    vocab_by_category = {}
    article_gender_map = {"der": "masculine", "die": "feminine", "das": "neuter"}
    for entry in results:
        category = entry.get("Category", "other").strip()
        word_obj = {
            "german": entry.get("German", "").strip(),
            "english": entry.get("English", "").strip(),
            "article": entry.get("Article", "").strip(),
            "gender": article_gender_map.get(entry.get("Article", "").strip(), ""),
            "partOfSpeech": entry.get("FigureOfSpeech", "").strip(),
            "germanSentences": entry.get("ExamplesGerman", []),
            "englishSentences": entry.get("ExamplesEnglish", [])
        }
        if category not in vocab_by_category:
            vocab_by_category[category] = []
        vocab_by_category[category].append(word_obj)

    # Save as JS file
    output_js = os.path.join(os.path.dirname(__file__), '../data/vocabularyData.js')
    with open(output_js, 'w', encoding='utf-8') as f:
        f.write('export const vocabularyData = ')
        json.dump(vocab_by_category, f, ensure_ascii=False, indent=2)
        f.write(';\n')
    logging.info(f"Done! Output written to {output_js}")

if __name__ == "__main__":
    asyncio.run(main()) # Run the async main function 