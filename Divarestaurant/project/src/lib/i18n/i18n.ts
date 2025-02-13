```typescript
import fr from './translations/fr';
import en from './translations/en';

type Language = 'fr' | 'en';
type TranslationKey = string;

class I18nService {
  private static instance: I18nService;
  private currentLanguage: Language = 'fr';
  private translations = { fr, en };

  private constructor() {}

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  setLanguage(lang: Language) {
    this.currentLanguage = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  translate(key: TranslationKey, params: Record<string, string> = {}): string {
    const keys = key.split('.');
    let translation = keys.reduce((obj, k) => obj?.[k], this.translations[this.currentLanguage]);

    if (typeof translation !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{{${param}}}`, value);
    });

    return translation;
  }

  async loadLanguage(lang: Language): Promise<void> {
    if (this.translations[lang]) {
      this.setLanguage(lang);
      return;
    }

    try {
      const module = await import(`./translations/${lang}.ts`);
      this.translations[lang] = module.default;
      this.setLanguage(lang);
    } catch (error) {
      console.error(`Failed to load language: ${lang}`, error);
    }
  }
}

export const i18n = I18nService.getInstance();
```