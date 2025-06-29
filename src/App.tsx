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
    <div className="min-h-screen bg-black text-white noise-overlay relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-display font-bold text-white mb-1">
                German Flashcards
              </h1>
              <p className="text-white/60 font-light tracking-wide">
                Master vocabulary with elegance
              </p>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Study Counter */}
              <div className="text-center animate-slide-up">
                <div className="text-sm text-white/50 font-medium uppercase tracking-wider mb-1">
                  Today
                </div>
                <div className="text-2xl font-display font-bold text-white">
                  {studiedToday}
                </div>
              </div>

              {/* Language Direction Toggle */}
              <div className="glass rounded-xl p-1 animate-scale-in">
                <button
                  onClick={() => setLanguageDirection("DE→EN")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    languageDirection === "DE→EN" 
                      ? "bg-white text-black shadow-lg" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  DE→EN
                </button>
                <button
                  onClick={() => setLanguageDirection("EN→DE")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Topic Selector */}
        <div className="mb-12 animate-slide-up">
          <label className="block text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
            Topic Selection
          </label>
          <select
            value={currentTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="glass rounded-xl px-4 py-3 text-white bg-transparent border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200 font-medium min-w-[300px]"
          >
            {topics.map(topic => (
              <option key={topic} value={topic} className="bg-black text-white">
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Main Flashcard */}
        <div className="mb-12 animate-fade-in">
          <div className="glass rounded-3xl overflow-hidden hover-lift shadow-2xl">
            {/* Card Header */}
            <div className="px-8 py-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                    {currentIndex + 1} of {currentVocabulary.length}
                  </span>
                  <div className="w-48 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((currentIndex + 1) / currentVocabulary.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => speakText(
                    isAnswerRevealed ? getBackText() : getFrontText(),
                    languageDirection === 'DE→EN' ? (isAnswerRevealed ? 'en' : 'de') : (isAnswerRevealed ? 'de' : 'en')
                  )}
                  className="btn-secondary p-3 rounded-xl hover:scale-105 transition-transform duration-200"
                  title="Pronounce word"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="px-8 py-16 text-center relative">
              <div className={`mb-8 ${isFlipping ? 'card-flip' : ''}`}>
                <div className="text-5xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
                  {isAnswerRevealed ? getBackText() : getFrontText()}
                </div>
                
                <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-full">
                  <span className="text-white/80 font-medium">
                    {currentCard.partOfSpeech}
                  </span>
                  {currentCard.gender && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                      {currentCard.gender}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleReveal}
                className="btn-primary px-10 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
              >
                {isAnswerRevealed ? "Hide Answer" : "Reveal Answer"}
              </button>
            </div>

            {/* Navigation */}
            <div className="px-8 py-6 border-t border-white/10 bg-white/5 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="btn-secondary flex items-center gap-3 px-6 py-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === currentVocabulary.length - 1}
                className="btn-secondary flex items-center gap-3 px-6 py-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
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
        <div className="glass rounded-3xl overflow-hidden hover-lift shadow-2xl animate-slide-up">
          <div className="px-8 py-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-white">
                Example Sentences
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePreviousSentence}
                  disabled={currentSentenceIndex === 0}
                  className="btn-secondary p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="text-sm text-white/60 font-medium min-w-[60px] text-center">
                  {currentSentenceIndex + 1} / {currentCard.germanSentences.length}
                </span>
                
                <button
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === currentCard.germanSentences.length - 1}
                  className="btn-secondary p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* German Sentence */}
              <div className="flex items-start gap-4">
                <button
                  onClick={() => speakText(currentCard.germanSentences[currentSentenceIndex], 'de')}
                  className="mt-2 btn-secondary p-3 rounded-xl hover:scale-110 transition-all duration-200 flex-shrink-0"
                  title="Pronounce German sentence"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                  </svg>
                </button>
                <p className="text-xl text-white leading-relaxed font-medium">
                  {currentCard.germanSentences[currentSentenceIndex]}
                </p>
              </div>

              {/* English Translation (shown when answer is revealed) */}
              {isAnswerRevealed && (
                <div className="flex items-start gap-4 pt-4 border-t border-white/10 animate-fade-in">
                  <button
                    onClick={() => speakText(currentCard.englishSentences[currentSentenceIndex], 'en')}
                    className="mt-2 btn-secondary p-3 rounded-xl hover:scale-110 transition-all duration-200 flex-shrink-0 opacity-70"
                    title="Pronounce English translation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072-7.072" />
                    </svg>
                  </button>
                  <p className="text-lg text-white/70 leading-relaxed font-light italic">
                    {currentCard.englishSentences[currentSentenceIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/40 font-light">
            Crafted for elegant language learning
          </p>
        </div>
      </main>
    </div>
  );
}