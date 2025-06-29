import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

interface UserStats {
  totalStudied: number;
  streak: number;
  accuracy: number;
  timeSpent: number;
  level: number;
  xp: number;
  lastStudyDate: string;
  topicProgress: { [key: string]: number };
  correctAnswers: number;
  totalAnswers: number;
}

const initialStats: UserStats = {
  totalStudied: 0,
  streak: 0,
  accuracy: 0,
  timeSpent: 0,
  level: 1,
  xp: 0,
  lastStudyDate: '',
  topicProgress: {},
  correctAnswers: 0,
  totalAnswers: 0
};

export function useStats() {
  const [stats, setStats] = useLocalStorage<UserStats>('flashcard-stats', initialStats);

  const updateStats = (updates: Partial<UserStats>) => {
    setStats(prev => {
      const newStats = { ...prev, ...updates };
      
      // Calculate accuracy
      if (newStats.totalAnswers > 0) {
        newStats.accuracy = Math.round((newStats.correctAnswers / newStats.totalAnswers) * 100);
      }
      
      // Calculate level based on XP
      newStats.level = Math.floor(newStats.xp / 100) + 1;
      
      return newStats;
    });
  };

  const addXP = (amount: number) => {
    updateStats({ xp: stats.xp + amount });
  };

  const recordAnswer = (isCorrect: boolean, difficulty: 'easy' | 'medium' | 'hard') => {
    const xpGain = isCorrect ? (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20) : 5;
    
    updateStats({
      totalAnswers: stats.totalAnswers + 1,
      correctAnswers: stats.correctAnswers + (isCorrect ? 1 : 0),
      totalStudied: stats.totalStudied + 1,
      xp: stats.xp + xpGain
    });
  };

  const updateTopicProgress = (topic: string, progress: number) => {
    updateStats({
      topicProgress: {
        ...stats.topicProgress,
        [topic]: progress
      }
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastStudy = new Date(stats.lastStudyDate).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastStudy === today) {
      // Already studied today, don't update streak
      return;
    } else if (lastStudy === yesterday) {
      // Studied yesterday, increment streak
      updateStats({
        streak: stats.streak + 1,
        lastStudyDate: today
      });
    } else if (lastStudy === '') {
      // First time studying
      updateStats({
        streak: 1,
        lastStudyDate: today
      });
    } else {
      // Streak broken, reset to 1
      updateStats({
        streak: 1,
        lastStudyDate: today
      });
    }
  };

  const addStudyTime = (minutes: number) => {
    updateStats({
      timeSpent: stats.timeSpent + minutes
    });
  };

  return {
    stats,
    updateStats,
    addXP,
    recordAnswer,
    updateTopicProgress,
    updateStreak,
    addStudyTime
  };
}