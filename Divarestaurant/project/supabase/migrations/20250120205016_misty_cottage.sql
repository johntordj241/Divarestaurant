/*
  # Ajout du système de notifications

  1. Nouvelles Tables
    - notifications
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - type (text)
      - message (text)
      - data (jsonb)
      - read (boolean)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on notifications table
    - Add policies for user access
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read 
  ON notifications(user_id, read);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
  ON notifications(created_at DESC);