export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot' | 'system';
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  status: 'active' | 'ended' | 'escalated';
}

export interface Intent {
  id: string;
  name: string;
  patterns: string[];
  responses: Response[];
}

export interface Response {
  id: string;
  intent_id: string;
  content: string;
  language: string;
}