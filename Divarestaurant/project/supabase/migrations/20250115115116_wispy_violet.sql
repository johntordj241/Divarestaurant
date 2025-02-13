/*
  # Configuration du ChatBot

  1. Tables
    - chatbot_conversations: Stocke les conversations
    - chatbot_messages: Stocke les messages
    - chatbot_intents: Stocke les intentions reconnues
    - chatbot_responses: Stocke les réponses prédéfinies

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour la lecture/écriture
*/

-- Conversations
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  status text CHECK (status IN ('active', 'ended', 'escalated'))
);

-- Messages
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chatbot_conversations(id),
  content text NOT NULL,
  type text CHECK (type IN ('user', 'bot', 'system')),
  created_at timestamptz DEFAULT now()
);

-- Intents
CREATE TABLE IF NOT EXISTS chatbot_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  patterns text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Responses
CREATE TABLE IF NOT EXISTS chatbot_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid REFERENCES chatbot_intents(id),
  content text NOT NULL,
  language text DEFAULT 'fr',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own conversations"
  ON chatbot_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON chatbot_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages from own conversations"
  ON chatbot_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chatbot_conversations
    WHERE id = conversation_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages to own conversations"
  ON chatbot_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM chatbot_conversations
    WHERE id = conversation_id AND user_id = auth.uid()
  ));

-- Insert default intents and responses
INSERT INTO chatbot_intents (name, patterns) VALUES
  ('reservation', ARRAY['réserver', 'réservation', 'table', 'places']),
  ('menu', ARRAY['menu', 'carte', 'plats', 'boissons']),
  ('horaires', ARRAY['horaires', 'ouverture', 'fermeture']),
  ('contact', ARRAY['contact', 'téléphone', 'email', 'adresse']);

INSERT INTO chatbot_responses (intent_id, content, language) 
SELECT 
  id,
  CASE 
    WHEN name = 'reservation' THEN 'Je peux vous aider à réserver une table. Pour combien de personnes souhaitez-vous réserver ?'
    WHEN name = 'menu' THEN 'Vous pouvez consulter notre menu complet dans la section Menu. Souhaitez-vous des recommandations particulières ?'
    WHEN name = 'horaires' THEN 'Nous sommes ouverts du mardi au dimanche de 19h à 2h. La cuisine est ouverte jusqu''à 23h.'
    WHEN name = 'contact' THEN 'Vous pouvez nous joindre au +33 4 93 00 00 00 ou par email à contact@diva-restaurant.com'
  END,
  'fr'
FROM chatbot_intents;