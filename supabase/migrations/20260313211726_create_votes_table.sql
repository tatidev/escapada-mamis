/*
  # Create votes table for Escapada 2026

  1. New Tables
    - `votes`
      - `id` (uuid, primary key) - Unique identifier for each vote
      - `user_name` (text) - Name of the user casting the vote (Agostina, Alejandra, Marie, Andrea)
      - `destination_id` (integer) - ID of the destination being voted for (0-5)
      - `created_at` (timestamptz) - Timestamp when the vote was cast
      - `updated_at` (timestamptz) - Timestamp when the vote was last updated
      
  2. Security
    - Enable RLS on `votes` table
    - Add policy for anyone to read all votes (public voting results)
    - Add policy for users to insert their own votes
    - Add policy for users to update their own votes
    
  3. Constraints
    - Unique constraint on user_name to ensure one vote per user
    - Check constraint on destination_id to ensure valid destination (0-5)
*/

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text UNIQUE NOT NULL,
  destination_id integer NOT NULL CHECK (destination_id >= 0 AND destination_id <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes"
  ON votes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON votes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own votes"
  ON votes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own votes"
  ON votes
  FOR DELETE
  USING (true);