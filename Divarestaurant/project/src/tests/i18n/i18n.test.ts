import { describe, it, expect, beforeEach } from 'vitest';
import { i18n } from '../../lib/i18n/i18n';

describe('I18n Service', () => {
  beforeEach(() => {
    i18n.setLanguage('fr');
  });

  it('should translate simple keys correctly', () => {
    expect(i18n.translate('common.welcome')).toBe('Bienvenue');
  });

  it('should handle nested translations', () => {
    expect(i18n.translate('booking.title')).toBe('Réservation');
  });

  it('should replace parameters in translations', () => {
    const translation = i18n.translate('booking.confirmation', {
      date: '01/03/2024',
      time: '19:00'
    });
    expect(translation).toContain('01/03/2024');
    expect(translation).toContain('19:00');
  });

  it('should switch languages correctly', () => {
    i18n.setLanguage('en');
    expect(i18n.translate('common.welcome')).toBe('Welcome');
    
    i18n.setLanguage('fr');
    expect(i18n.translate('common.welcome')).toBe('Bienvenue');
  });

  it('should return key if translation is missing', () => {
    expect(i18n.translate('invalid.key')).toBe('invalid.key');
  });

  it('should handle empty parameters', () => {
    expect(i18n.translate('common.welcome', {})).toBe('Bienvenue');
  });

  it('should persist language preference', () => {
    i18n.setLanguage('en');
    expect(localStorage.getItem('language')).toBe('en');
  });

  it('should load language asynchronously', async () => {
    await i18n.loadLanguage('en');
    expect(i18n.getLanguage()).toBe('en');
  });
});