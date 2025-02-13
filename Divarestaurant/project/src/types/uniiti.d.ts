interface UnitiConfig {
  restaurantId: string;
  lang?: string;
  theme?: 'light' | 'dark';
}

interface UnitiAPI {
  init: (config: UnitiConfig) => void;
  destroy?: () => void;
}

declare global {
  interface Window {
    Uniiti?: UnitiAPI;
  }
}

export {};