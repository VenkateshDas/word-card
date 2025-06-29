import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Clock, TrendingUp, Star } from 'lucide-react';

interface StatsPanelProps {
  stats: {
    totalStudied: number;
    streak: number;
    accuracy: number;
    timeSpent: number;
    level: number;
    xp: number;
  };
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getXPProgress = () => {
    const xpForNextLevel = (stats.level + 1) * 100;
    const currentLevelXP = stats.level * 100;
    const progressXP = stats.xp - currentLevelXP;
    return (progressXP / (xpForNextLevel - currentLevelXP)) * 100;
  };

  const statItems = [
    {
      icon: Trophy,
      label: 'Level',
      value: stats.level.toString(),
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-500/20'
    },
    {
      icon: Target,
      label: 'Studied',
      value: stats.totalStudied.toString(),
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Zap,
      label: 'Streak',
      value: `${stats.streak} days`,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: TrendingUp,
      label: 'Accuracy',
      value: `${stats.accuracy}%`,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Clock,
      label: 'Time',
      value: formatTime(stats.timeSpent),
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'bg-cyan-500/20'
    },
    {
      icon: Star,
      label: 'XP',
      value: stats.xp.toString(),
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'bg-indigo-500/20'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Level Progress */}
      <div className="mb-6 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Level {stats.level}</h3>
              <p className="text-white/60 text-sm">
                {stats.xp} / {(stats.level + 1) * 100} XP
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-sm">Next Level</div>
            <div className="text-white font-bold">
              {(stats.level + 1) * 100 - stats.xp} XP to go
            </div>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full h-3"
            initial={{ width: 0 }}
            animate={{ width: `${getXPProgress()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-center"
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${stat.bgColor}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-white font-bold text-lg mb-1">
              {stat.value}
            </div>
            <div className="text-white/60 text-sm font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}