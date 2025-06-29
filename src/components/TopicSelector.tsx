import { motion } from 'framer-motion';
import { Users, UtensilsCrossed, Home, Clock, Cloud, Briefcase, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TopicSelectorProps {
  topics: string[];
  currentTopic: string;
  onTopicChange: (topic: string) => void;
  progress: { [key: string]: number };
}

const topicIcons: { [key: string]: any } = {
  'People & Family': Users,
  'Food & Drink': UtensilsCrossed,
  'Home & Objects': Home,
  'Numbers & Time': Clock,
  'Days & Weather': Cloud,
  'Work & Education': Briefcase,
};

export default function TopicSelector({ topics, currentTopic, onTopicChange, progress }: TopicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getTopicProgress = (topic: string) => {
    return progress[topic] || 0;
  };

  const getCurrentIcon = () => {
    const IconComponent = topicIcons[currentTopic] || Users;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full md:w-auto min-w-64 px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          {getCurrentIcon()}
          <span className="truncate">{currentTopic}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            {topics.map((topic, index) => {
              const IconComponent = topicIcons[topic] || Users;
              const progressPercent = getTopicProgress(topic);
              
              return (
                <motion.button
                  key={topic}
                  onClick={() => {
                    onTopicChange(topic);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                  className={`
                    w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between
                    ${topic === currentTopic ? 'bg-indigo-500/20 text-indigo-700' : 'text-gray-700 hover:text-indigo-600'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{topic}</span>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 min-w-8">
                      {Math.round(progressPercent)}%
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}