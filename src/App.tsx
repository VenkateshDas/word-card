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
  const [isFlipping, setIsFlipping] = useState(false);

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
    setIsFlipping(true);
    setTimeout(() => {
      setIsAnswerRevealed(!isAnswerRevealed);
      setIsFlipping(false);
      if (!isAnswerRevealed) {
        setStudiedToday(prev => prev + 1);
      }
    }, 300);
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
      return currentCard.german;
    } else {
      return currentCard.english;
    }
  };

  const getBackText = () => {
    if (languageDirection === "DE→EN") {
      return currentCard.english;
    } else {
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '30px 30px'
      }} />

      {/* Compact Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-display font-bold text-white">
                German Cards
              </h1>
              <p className="text-xs text-white/60 font-light">
                Learn with elegance
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Study Counter */}
              <div className="text-center">
                <div className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  Today
                </div>
                <div className="text-lg font-display font-bold text-white">
                  {studiedToday}
                </div>
              </div>

              {/* Language Direction Toggle */}
              <div className="glass rounded-lg p-0.5">
                <button
                  onClick={() => setLanguageDirection("DE→EN")}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-all duration-200 ${
                    languageDirection === "DE→EN" 
                      ? "bg-white text-black" 
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  DE→EN
                </button>
                <button
                  onClick={() => setLanguageDirection("EN→DE")}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-all duration-200 ${
                    languageDirection === "EN→DE" 
                      ? "bg-white text-black" 
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  EN→DE
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4 pb-safe">
        {/* Topic Selector */}
        <div>
          <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wider">
            Topic
          </label>
          <select
            value={currentTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="glass rounded-lg px-3 py-2.5 text-sm text-white bg-transparent border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200 font-medium w-full"
          >
            {topics.map(topic => (
              <option key={topic} value={topic} className="bg-black text-white">
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Main Flashcard */}
        <div className="glass rounded-xl overflow-hidden shadow-2xl">
          {/* Card Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  {currentIndex + 1} of {currentVocabulary.length}
                </span>
                <div className="w-20 bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-white h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + 1) / currentVocabulary.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <button
                onClick={() => speakText(
                  isAnswerRevealed ? getBackText() : getFrontText(),
                  languageDirection === 'DE→EN' ? (isAnswerRevealed ? 'en' : 'de') : (isAnswerRevealed ? 'de' : 'en')
                )}
                className="btn-secondary p-2 rounded-lg hover:scale-105 transition-transform duration-200"
                title="Pronounce word"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-4 py-8 text-center relative min-h-[200px] flex flex-col justify-center">
            <div className={`mb-6 ${isFlipping ? 'card-flip' : ''}`}>
              <div className="text-3xl font-display font-bold text-white mb-4 leading-tight break-words">
                {isAnswerRevealed ? getBackText() : getFrontText()}
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full">
                <span className="text-white/80 font-medium text-sm">
                  {currentCard.partOfSpeech}
                </span>
                {currentCard.gender && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                    {currentCard.gender}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleReveal}
              className="btn-primary px-8 py-3 rounded-xl text-base font-semibold hover:scale-105 transition-all duration-200 shadow-xl mx-auto"
            >
              {isAnswerRevealed ? "Hide Answer" : "Reveal Answer"}
            </button>
          </div>

          {/* Navigation */}
          <div className="px-4 py-3 border-t border-white/10 bg-white/5 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentIndex === currentVocabulary.length - 1}
              className="btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 text-sm"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Example Sentences */}
        <div className="glass rounded-xl overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-white">
                Examples
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousSentence}
                  disabled={currentSentenceIndex === 0}
                  className="btn-secondary p-1.5 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="text-xs text-white/60 font-medium min-w-[35px] text-center">
                  {currentSentenceIndex + 1}/{currentCard.germanSentences.length}
                </span>
                
                <button
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === currentCard.germanSentences.length - 1}
                  className="btn-secondary p-1.5 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="space-y-3">
              {/* German Sentence */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => speakText(currentCard.germanSentences[currentSentenceIndex], 'de')}
                  className="mt-0.5 btn-secondary p-2 rounded hover:scale-110 transition-all duration-200 flex-shrink-0"
                  title="Pronounce German sentence"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                  </svg>
                </button>
                <p className="text-sm text-white leading-relaxed font-medium break-words flex-1">
                  {currentCard.germanSentences[currentSentenceIndex]}
                </p>
              </div>

              {/* English Translation */}
              {isAnswerRevealed && (
                <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => speakText(currentCard.englishSentences[currentSentenceIndex], 'en')}
                    className="mt-0.5 btn-secondary p-2 rounded hover:scale-110 transition-all duration-200 flex-shrink-0 opacity-70"
                    title="Pronounce English translation"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                    </svg>
                  </button>
                  <p className="text-sm text-white/70 leading-relaxed font-light italic break-words flex-1">
                    {currentCard.englishSentences[currentSentenceIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-white/40 font-light">
            Elegant language learning
          </p>
        </div>
      </main>
    </div>
  );
}