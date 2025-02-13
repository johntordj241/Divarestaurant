```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { AuthProvider } from '../../components/auth/AuthProvider';

describe('Application Integration Tests', () => {
  it('should navigate between pages correctly', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Test navigation
    const menuLink = screen.getByText('MENU');
    fireEvent.click(menuLink);
    await waitFor(() => {
      expect(window.location.hash).toBe('#menu');
    });

    const bookingLink = screen.getByText('BOOKING');
    fireEvent.click(bookingLink);
    await waitFor(() => {
      expect(window.location.hash).toBe('#booking');
    });
  });

  it('should handle reservation flow correctly', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Navigate to booking
    const bookingLink = screen.getByText('BOOKING');
    fireEvent.click(bookingLink);

    // Fill reservation form
    const dateInput = screen.getByLabelText(/date/i);
    fireEvent.change(dateInput, { target: { value: '2024-03-01' } });

    const guestsInput = screen.getByLabelText(/invités/i);
    fireEvent.change(guestsInput, { target: { value: '4' } });

    // Continue to next step
    const nextButton = screen.getByText(/continuer/i);
    fireEvent.click(nextButton);

    // Verify menu selection is shown
    await waitFor(() => {
      expect(screen.getByText(/menu classique/i)).toBeInTheDocument();
    });
  });

  it('should handle authentication flow correctly', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Try to access protected route
    const adminLink = screen.getByText('ADMIN');
    fireEvent.click(adminLink);

    // Verify login form is shown
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
    });
  });
});
```