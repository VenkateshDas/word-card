import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Settings, BarChart3, BookOpen, Sparkles } from 'lucide-react';
// @ts-ignore
import { vocabularyData } from "../data/vocabularyData.js";

import FlashCard from './components/FlashCard';
import ExampleSentences from './components/ExampleSentences';
import TopicSelector from './components/TopicSelector';
import LanguageToggle from './components/LanguageToggle';
import StatsPanel from './components/StatsPanel';
import { useStats } from './hooks/useStats';

type ViewMode = 'study' | 'stats' | 'settings';

export default function FlashcardApp() {
  const [currentTopic, setCurrentTopic] = useState("People & Family");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [languageDirection, setLanguageDirection] = useState<"DE→EN" | "EN→DE">("DE→EN");
  const [viewMode, setViewMode] = useState<ViewMode>('study');
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  const { stats, recordAnswer, updateTopicProgress, updateStreak, addStudyTime } = useStats();

  const currentVocabulary = vocabularyData[currentTopic as keyof typeof vocabularyData];
  const currentCard = currentVocabulary[currentIndex];
  const topics = Object.keys(vocabularyData);

  // Update topic progress
  useEffect(() => {
    const progress = ((currentIndex + 1) / currentVocabulary.length) * 100;
    updateTopicProgress(currentTopic, progress);
  }, [currentIndex, currentTopic, currentVocabulary.length, updateTopicProgress]);

  // Track study time
  useEffect(() => {
    const interval = setInterval(() => {
      const studyTime = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
      if (studyTime > 0) {
        addStudyTime(1);
      }
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [sessionStartTime, addStudyTime]);

  // Update streak on first load
  useEffect(() => {
    updateStreak();
  }, []);

  const handleTopicChange = (topic: string) => {
    setCurrentTopic(topic);
    setCurrentIndex(0);
    setCurrentSentenceIndex(0);
    setIsAnswerRevealed(false);
  };

  const handleLanguageSwitch = (direction: "DE→EN" | "EN→DE") => {
    setLanguageDirection(direction);
    setIsAnswerRevealed(false);
  };

  const handleRevealToggle = () => {
    setIsAnswerRevealed(!isAnswerRevealed);
  };

  const handleNext = () => {
    if (currentIndex < currentVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSentenceIndex(0);
      setIsAnswerRevealed(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentSentenceIndex(0);
      setIsAnswerRevealed(false);
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

  const handleDifficultyRate = (difficulty: 'easy' | 'medium' | 'hard') => {
    const isCorrect = difficulty === 'easy';
    recordAnswer(isCorrect, difficulty);
    
    if (isCorrect) {
      setStreak(prev => prev + 1);
      if ((streak + 1) % 10 === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      setStreak(0);
    }

    // Auto-advance after rating
    setTimeout(() => {
      if (currentIndex < currentVocabulary.length - 1) {
        handleNext();
      }
    }, 1000);
  };

  const backgroundStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .floating { animation: float 6s ease-in-out infinite; }
        `}
      </style>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div style={backgroundStyle}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl floating" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg floating" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl floating" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-300/15 rounded-full blur-xl floating" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">WordEasy</h1>
                  <p className="text-white/60 text-sm">Master German with AI</p>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setViewMode('study')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                    ${viewMode === 'study' 
                      ? 'bg-white text-indigo-600 shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <BookOpen className="w-4 h-4" />
                  Study
                </motion.button>
                
                <motion.button
                  onClick={() => setViewMode('stats')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                    ${viewMode === 'stats' 
                      ? 'bg-white text-indigo-600 shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <BarChart3 className="w-4 h-4" />
                  Stats
                </motion.button>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="flex-1 px-6 pb-6">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {viewMode === 'study' && (
                  <motion.div
                    key="study"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <TopicSelector
                        topics={topics}
                        currentTopic={currentTopic}
                        onTopicChange={handleTopicChange}
                        progress={stats.topicProgress}
                      />
                      
                      <LanguageToggle
                        direction={languageDirection}
                        onToggle={handleLanguageSwitch}
                      />
                    </div>

                    {/* Flash Card */}
                    <FlashCard
                      word={currentCard}
                      languageDirection={languageDirection}
                      isRevealed={isAnswerRevealed}
                      onReveal={handleRevealToggle}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      canGoNext={currentIndex < currentVocabulary.length - 1}
                      canGoPrevious={currentIndex > 0}
                      currentIndex={currentIndex}
                      totalCards={currentVocabulary.length}
                      onDifficultyRate={handleDifficultyRate}
                      streak={streak}
                    />

                    {/* Example Sentences */}
                    <ExampleSentences
                      germanSentences={currentCard.germanSentences}
                      englishSentences={currentCard.englishSentences}
                      currentIndex={currentSentenceIndex}
                      onNext={handleNextSentence}
                      onPrevious={handlePreviousSentence}
                      isRevealed={isAnswerRevealed}
                      languageDirection={languageDirection}
                    />
                  </motion.div>
                )}

                {viewMode === 'stats' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <StatsPanel stats={stats} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}