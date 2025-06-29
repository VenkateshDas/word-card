import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Volume2 } from 'lucide-react';

interface ExampleSentencesProps {
  germanSentences: string[];
  englishSentences: string[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  isRevealed: boolean;
  languageDirection: 'DE→EN' | 'EN→DE';
}

export default function ExampleSentences({
  germanSentences,
  englishSentences,
  currentIndex,
  onNext,
  onPrevious,
  isRevealed,
  languageDirection
}: ExampleSentencesProps) {
  const canGoNext = currentIndex < germanSentences.length - 1;
  const canGoPrevious = currentIndex > 0;

  const speakSentence = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getPrimarySentence = () => {
    return languageDirection === 'DE→EN' ? germanSentences[currentIndex] : englishSentences[currentIndex];
  };

  const getSecondarySentence = () => {
    return languageDirection === 'DE→EN' ? englishSentences[currentIndex] : germanSentences[currentIndex];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white/80" />
            <h3 className="text-white font-semibold">Example Sentences</h3>
          </div>
          <div className="text-white/60 text-sm font-medium">
            {currentIndex + 1} / {germanSentences.length}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            whileHover={{ scale: canGoPrevious ? 1.1 : 1 }}
            whileTap={{ scale: canGoPrevious ? 0.9 : 1 }}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
              ${canGoPrevious 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 max-w-xs">
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / germanSentences.length) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          <motion.button
            onClick={onNext}
            disabled={!canGoNext}
            whileHover={{ scale: canGoNext ? 1.1 : 1 }}
            whileTap={{ scale: canGoNext ? 0.9 : 1 }}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
              ${canGoNext 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Sentence Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Primary Sentence */}
            <div className="relative">
              <div className="flex items-start gap-3 p-4 bg-white/10 rounded-xl">
                <motion.button
                  onClick={() => speakSentence(
                    getPrimarySentence(),
                    languageDirection === 'DE→EN' ? 'de' : 'en'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:bg-white/30 transition-colors flex-shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </motion.button>
                <p className="text-white text-lg font-medium leading-relaxed">
                  {getPrimarySentence()}
                </p>
              </div>
            </div>

            {/* Secondary Sentence (Translation) */}
            <AnimatePresence>
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <motion.button
                      onClick={() => speakSentence(
                        getSecondarySentence(),
                        languageDirection === 'DE→EN' ? 'en' : 'de'
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="mt-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white/60 hover:bg-white/30 transition-colors flex-shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.button>
                    <p className="text-white/80 text-base leading-relaxed italic">
                      {getSecondarySentence()}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}