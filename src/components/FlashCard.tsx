import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Zap, Star, Trophy, Target } from 'lucide-react';

interface FlashCardProps {
  word: {
    german: string;
    english: string;
    article: string;
    gender: string;
    partOfSpeech: string;
    germanSentences: string[];
    englishSentences: string[];
  };
  languageDirection: 'DE→EN' | 'EN→DE';
  isRevealed: boolean;
  onReveal: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentIndex: number;
  totalCards: number;
  onDifficultyRate: (difficulty: 'easy' | 'medium' | 'hard') => void;
  streak: number;
}

export default function FlashCard({
  word,
  languageDirection,
  isRevealed,
  onReveal,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  currentIndex,
  totalCards,
  onDifficultyRate,
  streak
}: FlashCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const getFrontText = () => {
    if (languageDirection === "DE→EN") {
      return word.article ? `${word.article} ${word.german}` : word.german;
    } else {
      return word.english;
    }
  };

  const getBackText = () => {
    if (languageDirection === "DE→EN") {
      return word.english;
    } else {
      return word.article ? `${word.article} ${word.german}` : word.german;
    }
  };

  const handleReveal = () => {
    setIsFlipping(true);
    setTimeout(() => {
      onReveal();
      setIsFlipping(false);
    }, 300);
  };

  const handleDifficultyRate = (difficulty: 'easy' | 'medium' | 'hard') => {
    onDifficultyRate(difficulty);
    if (difficulty === 'easy' && streak > 0 && streak % 5 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
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
    <div className="relative">
      {/* Streak Indicator */}
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Zap className="w-4 h-4" />
            <span className="font-bold">{streak} streak!</span>
          </div>
        </motion.div>
      )}

      {/* Main Card Container */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Previous Button */}
        <motion.button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          whileHover={{ scale: canGoPrevious ? 1.1 : 1 }}
          whileTap={{ scale: canGoPrevious ? 0.95 : 1 }}
          className={`
            w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg
            ${canGoPrevious 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Flash Card */}
        <motion.div
          className="relative w-full max-w-md h-80 md:h-96"
          style={{ perspective: '1000px' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isRevealed ? 'back' : 'front'}
              initial={{ rotateY: isFlipping ? -90 : 0, opacity: isFlipping ? 0 : 1 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`
                absolute inset-0 w-full h-full rounded-3xl p-8
                flex flex-col items-center justify-center text-center
                shadow-2xl border border-white/20 backdrop-blur-xl
                ${isRevealed 
                  ? 'bg-gradient-to-br from-emerald-400/90 to-teal-600/90' 
                  : 'bg-gradient-to-br from-blue-500/90 to-purple-600/90'
                }
              `}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Content */}
              <div className="relative z-10 w-full">
                {/* Audio Button */}
                <motion.button
                  onClick={() => speakText(
                    isRevealed ? getBackText() : getFrontText(),
                    languageDirection === 'DE→EN' ? (isRevealed ? 'en' : 'de') : (isRevealed ? 'de' : 'en')
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-0 right-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </motion.button>

                {/* Main Text */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {isRevealed ? getBackText() : getFrontText()}
                  </h2>
                  
                  {/* Part of Speech Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm font-medium">
                    {word.partOfSpeech}
                    {word.gender && (
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                        {word.gender}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Progress Indicator */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm font-medium">
                      {currentIndex + 1} / {totalCards}
                    </span>
                    <span className="text-white/80 text-sm">
                      {Math.round(((currentIndex + 1) / totalCards) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      className="bg-white rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full" />
              <div className="absolute bottom-8 right-8 w-6 h-6 bg-white/10 rounded-full" />
              <div className="absolute top-1/2 left-2 w-4 h-4 bg-white/10 rounded-full" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Next Button */}
        <motion.button
          onClick={onNext}
          disabled={!canGoNext}
          whileHover={{ scale: canGoNext ? 1.1 : 1 }}
          whileTap={{ scale: canGoNext ? 0.95 : 1 }}
          className={`
            w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg
            ${canGoNext 
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-xl' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {!isRevealed ? (
          <motion.button
            onClick={handleReveal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reveal Answer
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <motion.button
              onClick={() => handleDifficultyRate('easy')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Easy
            </motion.button>
            <motion.button
              onClick={() => handleDifficultyRate('medium')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Medium
            </motion.button>
            <motion.button
              onClick={() => handleDifficultyRate('hard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Hard
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Celebration Effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <div className="font-bold text-lg">Streak Milestone!</div>
                  <div className="text-sm opacity-90">Keep up the great work!</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}