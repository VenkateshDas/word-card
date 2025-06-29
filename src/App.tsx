import { useState, useEffect } from "react";
// @ts-ignore
import { vocabularyData } from "../data/vocabularyData.js";

export default function FlashcardApp() {
  const [currentTopic, setCurrentTopic] = useState("People & Family");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [languageDirection, setLanguageDirection] = useState<"DE→EN" | "EN→DE">("DE→EN");
  const [studiedToday, setStudiedToday] = useState(0);

  const currentVocabulary = vocabularyData[currentTopic as keyof typeof vocabularyData];
  const currentCard = currentVocabulary[currentIndex];
  const topics = Object.keys(vocabularyData);

  const handleTopicChange = (topic: string) => {
    setCurrentTopic(topic);
    setCurrentIndex(0);
    setCurrentSentenceIndex(0);
    setIsAnswerRevealed(false);
  };

  const handleNext = () => {
    if (currentIndex < currentVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSentenceIndex(0);
      setIsAnswerRevealed(false);
      if (isAnswerRevealed) {
        setStudiedToday(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentSentenceIndex(0);
      setIsAnswerRevealed(false);
    }
  };

  const handleReveal = () => {
    setIsAnswerRevealed(!isAnswerRevealed);
    if (!isAnswerRevealed) {
      setStudiedToday(prev => prev + 1);
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < currentCard.germanSentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    }
  };

  const handlePreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    }
  };

  const getFrontText = () => {
    if (languageDirection === "DE→EN") {
      // Just return the German word as-is since it already includes the article
      return currentCard.german;
    } else {
      return currentCard.english;
    }
  };

  const getBackText = () => {
    if (languageDirection === "DE→EN") {
      return currentCard.english;
    } else {
      // Just return the German word as-is since it already includes the article
      return currentCard.german;
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">German Cards</h1>
              <p className="text-sm text-gray-600">Learn vocabulary effectively</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Today</div>
                <div className="text-lg font-semibold text-blue-600">{studiedToday}</div>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguageDirection("DE→EN")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    languageDirection === "DE→EN" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  DE→EN
                </button>
                <button
                  onClick={() => setLanguageDirection("EN→DE")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    languageDirection === "EN→DE" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  EN→DE
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Topic Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
          <select
            value={currentTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="w-full max-w-xs px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Main Card */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {currentIndex + 1} of {currentVocabulary.length}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / currentVocabulary.length) * 100}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => speakText(
                    isAnswerRevealed ? getBackText() : getFrontText(),
                    languageDirection === 'DE→EN' ? (isAnswerRevealed ? 'en' : 'de') : (isAnswerRevealed ? 'de' : 'en')
                  )}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="px-6 py-12 text-center">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-3">
                  {isAnswerRevealed ? getBackText() : getFrontText()}
                </div>
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {currentCard.partOfSpeech}
                  {currentCard.gender && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs">
                      {currentCard.gender}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleReveal}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                {isAnswerRevealed ? "Hide Answer" : "Show Answer"}
              </button>
            </div>

            {/* Navigation */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === currentVocabulary.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Example Sentences */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Example Sentences</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousSentence}
                  disabled={currentSentenceIndex === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600">
                  {currentSentenceIndex + 1} / {currentCard.germanSentences.length}
                </span>
                <button
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === currentCard.germanSentences.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => speakText(
                    currentCard.germanSentences[currentSentenceIndex],
                    'de'
                  )}
                  className="mt-1 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                  </svg>
                </button>
                <p className="text-lg text-gray-900 leading-relaxed">
                  {currentCard.germanSentences[currentSentenceIndex]}
                </p>
              </div>

              {isAnswerRevealed && (
                <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => speakText(
                      currentCard.englishSentences[currentSentenceIndex],
                      'en'
                    )}
                    className="mt-1 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                    </svg>
                  </button>
                  <p className="text-gray-600 leading-relaxed italic">
                    {currentCard.englishSentences[currentSentenceIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}