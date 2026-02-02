import { useState, useCallback } from "react";

export interface ScoreEntry {
  username: string;
  score: number;
  date: string;
}

const STORAGE_KEY = "flappyLeaderboard";
const MAX_SCORES = 100;

export const useLeaderboard = () => {
  const [scores, setScores] = useState<ScoreEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addScore = useCallback((username: string, score: number) => {
    const newEntry: ScoreEntry = {
      username,
      score,
      date: new Date().toISOString(),
    };

    setScores((prev) => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_SCORES);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newEntry;
  }, []);

  const getHighScore = useCallback(() => {
    return scores.length > 0 ? scores[0].score : 0;
  }, [scores]);

  const getUserHighScore = useCallback((username: string) => {
    const userScores = scores.filter((s) => s.username === username);
    return userScores.length > 0 ? userScores[0].score : 0;
  }, [scores]);

  return {
    scores,
    addScore,
    getHighScore,
    getUserHighScore,
  };
};
