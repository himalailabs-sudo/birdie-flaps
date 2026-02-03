-- Create a table for snake leaderboard
CREATE TABLE public.snake_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient score ranking
CREATE INDEX idx_snake_leaderboard_score ON public.snake_leaderboard(score DESC);

-- Enable Row Level Security
ALTER TABLE public.snake_leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (same as regular leaderboard)
CREATE POLICY "Anyone can view snake leaderboard" 
ON public.snake_leaderboard 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add snake scores" 
ON public.snake_leaderboard 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for snake leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.snake_leaderboard;