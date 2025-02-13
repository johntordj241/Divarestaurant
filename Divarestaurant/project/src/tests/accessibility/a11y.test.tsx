import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReservationForm } from '../../components/reservation/ReservationForm';
import { MenuPage } from '../../components/menu/MenuPage';
import { HomePage } from '../../components/home/HomePage';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('HomePage', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<HomePage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', () => {
      render(<HomePage />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('should have alt text for all images', () => {
      render(<HomePage />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('should have proper ARIA landmarks', () => {
      render(<HomePage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('ReservationForm', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ReservationForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form labeling', () => {
      render(<ReservationForm />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should handle keyboard navigation', () => {
      render(<ReservationForm />);
      const firstInput = screen.getByLabelText(/nom/i);
      firstInput.focus();
      expect(document.activeElement).toBe(firstInput);
    });

    it('should announce form errors', () => {
      render(<ReservationForm />);
      const errors = screen.getAllByRole('alert');
      errors.forEach(error => {
        expect(error).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('should have proper focus management', () => {
      render(<ReservationForm />);
      const submitButton = screen.getByRole('button', { name: /confirmer/i });
      submitButton.focus();
      expect(document.activeElement).toBe(submitButton);
    });
  });

  describe('MenuPage', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<MenuPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA landmarks', () => {
      render(<MenuPage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have sufficient color contrast', () => {
      render(<MenuPage />);
      const elements = screen.getAllByText(/.+/);
      elements.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.color).toHaveContrastWith(styles.backgroundColor);
      });
    });

    it('should have proper button labeling', () => {
      render(<MenuPage />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });
});