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
    <div className="min-h-screen bg-black text-white noise-overlay relative overflow-x-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Header - Compact */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white mb-0.5">
                German Flashcards
              </h1>
              <p className="text-xs sm:text-sm text-white/60 font-light tracking-wide">
                Master vocabulary with elegance
              </p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Study Counter */}
              <div className="text-center animate-slide-up">
                <div className="text-xs text-white/50 font-medium uppercase tracking-wider mb-0.5">
                  Today
                </div>
                <div className="text-lg sm:text-xl font-display font-bold text-white">
                  {studiedToday}
                </div>
              </div>

              {/* Language Direction Toggle */}
              <div className="glass rounded-lg p-0.5 animate-scale-in">
                <button
                  onClick={() => setLanguageDirection("DE→EN")}
                  className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ${
                    languageDirection === "DE→EN" 
                      ? "bg-white text-black shadow-lg" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  DE→EN
                </button>
                <button
                  onClick={() => setLanguageDirection("EN→DE")}
                  className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ${
                    languageDirection === "EN→DE" 
                      ? "bg-white text-black shadow-lg" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  EN→DE
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Topic Selector - Compact */}
        <div className="animate-slide-up">
          <label className="block text-xs font-medium text-white/70 mb-2 uppercase tracking-wider">
            Topic Selection
          </label>
          <select
            value={currentTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="glass rounded-lg px-3 py-2 text-sm text-white bg-transparent border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200 font-medium w-full sm:w-auto sm:min-w-[280px]"
          >
            {topics.map(topic => (
              <option key={topic} value={topic} className="bg-black text-white">
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Main Flashcard - Optimized Height */}
        <div className="animate-fade-in">
          <div className="glass rounded-2xl overflow-hidden hover-lift shadow-2xl">
            {/* Card Header - Compact */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    {currentIndex + 1} of {currentVocabulary.length}
                  </span>
                  <div className="w-24 sm:w-32 bg-white/10 rounded-full h-1.5 overflow-hidden">
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

            {/* Card Content - Optimized Size */}
            <div className="px-4 sm:px-6 py-6 sm:py-8 text-center relative">
              <div className={`mb-4 sm:mb-6 ${isFlipping ? 'card-flip' : ''}`}>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 leading-tight break-words">
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
                className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
              >
                {isAnswerRevealed ? "Hide Answer" : "Reveal Answer"}
              </button>
            </div>

            {/* Navigation - Compact */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-white/5 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="btn-secondary flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 text-sm"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === currentVocabulary.length - 1}
                className="btn-secondary flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 text-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Example Sentences - Compact */}
        <div className="glass rounded-2xl overflow-hidden hover-lift shadow-2xl animate-slide-up">
          <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base sm:text-lg font-semibold text-white">
                Example Sentences
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePreviousSentence}
                  disabled={currentSentenceIndex === 0}
                  className="btn-secondary p-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="text-xs text-white/60 font-medium min-w-[40px] text-center">
                  {currentSentenceIndex + 1}/{currentCard.germanSentences.length}
                </span>
                
                <button
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === currentCard.germanSentences.length - 1}
                  className="btn-secondary p-1.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="space-y-3 sm:space-y-4">
              {/* German Sentence */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => speakText(currentCard.germanSentences[currentSentenceIndex], 'de')}
                  className="mt-1 btn-secondary p-2 rounded-lg hover:scale-110 transition-all duration-200 flex-shrink-0"
                  title="Pronounce German sentence"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                  </svg>
                </button>
                <p className="text-sm sm:text-base text-white leading-relaxed font-medium break-words">
                  {currentCard.germanSentences[currentSentenceIndex]}
                </p>
              </div>

              {/* English Translation */}
              {isAnswerRevealed && (
                <div className="flex items-start gap-3 pt-2 sm:pt-3 border-t border-white/10 animate-fade-in">
                  <button
                    onClick={() => speakText(currentCard.englishSentences[currentSentenceIndex], 'en')}
                    className="mt-1 btn-secondary p-2 rounded-lg hover:scale-110 transition-all duration-200 flex-shrink-0 opacity-70"
                    title="Pronounce English translation"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                    </svg>
                  </button>
                  <p className="text-sm text-white/70 leading-relaxed font-light italic break-words">
                    {currentCard.englishSentences[currentSentenceIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Minimal */}
        <div className="text-center py-2">
          <p className="text-xs text-white/40 font-light">
            Crafted for elegant language learning
          </p>
        </div>
      </main>
    </div>
  );
}