import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockClient } from '@supabase/supabase-js';

// Mock des variables d'environnement
vi.mock('../lib/supabase/client', () => ({
  supabase: mockClient
}));

// Configuration globale
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Nettoyage après chaque test
afterEach(() => {
  vi.clearAllMocks();
});