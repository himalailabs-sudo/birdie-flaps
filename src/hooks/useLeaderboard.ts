import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ScoreEntry {
  id: string;
  username: string;
  score: number;
  created_at: string;
}

const MAX_SCORES = 100;

export const useLeaderboard = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial scores
  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .limit(MAX_SCORES);

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        setScores(data || []);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leaderboard",
        },
        (payload) => {
          const newScore = payload.new as ScoreEntry;
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
      .from("leaderboard")
      .insert({ username, score })
      .select()
      .single();

    if (error) {
      console.error("Error adding score:", error);
      return null;
    }

    return data;
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
