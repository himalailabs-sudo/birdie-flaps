import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SnakeScoreEntry {
  id: string;
  username: string;
  score: number;
  created_at: string;
}

const MAX_SCORES = 100;

export const useSnakeLeaderboard = () => {
  const [scores, setScores] = useState<SnakeScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial scores
  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("snake_leaderboard" as any)
        .select("*")
        .order("score", { ascending: false })
        .limit(MAX_SCORES);

      if (error) {
        console.error("Error fetching snake leaderboard:", error);
      } else {
        setScores((data as unknown as SnakeScoreEntry[]) || []);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("snake-leaderboard-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "snake_leaderboard",
        },
        (payload) => {
          const newScore = payload.new as SnakeScoreEntry;
          setScores((prev) => {
            const updated = [...prev, newScore]
              .sort((a, b) => b.score - a.score)
              .slice(0, MAX_SCORES);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addScore = useCallback(async (username: string, score: number) => {
    const { data, error } = await supabase
      .from("snake_leaderboard" as any)
      .insert({ username, score })
      .select()
      .single();

    if (error) {
      console.error("Error adding snake score:", error);
      return null;
    }

    return data as unknown as SnakeScoreEntry;
  }, []);

  const getHighScore = useCallback(() => {
    return scores.length > 0 ? scores[0].score : 0;
  }, [scores]);

  const getUserHighScore = useCallback(
    (username: string) => {
      const userScores = scores.filter((s) => s.username === username);
      return userScores.length > 0 ? userScores[0].score : 0;
    },
    [scores]
  );

  return {
    scores,
    loading,
    addScore,
    getHighScore,
    getUserHighScore,
  };
};
