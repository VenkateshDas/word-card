import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface LanguageToggleProps {
  direction: 'DE→EN' | 'EN→DE';
  onToggle: (direction: 'DE→EN' | 'EN→DE') => void;
}

export default function LanguageToggle({ direction, onToggle }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
      <motion.button
        onClick={() => onToggle('DE→EN')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
          ${direction === 'DE→EN' 
            ? 'bg-white text-indigo-600 shadow-lg' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }
        `}
      >
        <span className="font-bold">DE</span>
        <ArrowLeftRight className="w-3 h-3" />
        <span className="font-bold">EN</span>
      </motion.button>
      
      <motion.button
        onClick={() => onToggle('EN→DE')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
          ${direction === 'EN→DE' 
            ? 'bg-white text-indigo-600 shadow-lg' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }
        `}
      >
        <span className="font-bold">EN</span>
        <ArrowLeftRight className="w-3 h-3" />
        <span className="font-bold">DE</span>
      </motion.button>
    </div>
  );
}