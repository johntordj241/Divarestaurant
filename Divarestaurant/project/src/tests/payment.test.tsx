import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentForm } from '../components/payment/PaymentForm';
import { StripeService } from '../lib/payment/StripeService';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    elements: vi.fn(),
    confirmPayment: vi.fn()
  }))
}));

describe('PaymentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProps = {
    amount: 150,
    onSuccess: vi.fn(),
    onError: vi.fn()
  };

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <Elements stripe={loadStripe('dummy_key')}>
      {children}
    </Elements>
  );

  it('should display correct amount', () => {
    render(<TestWrapper><PaymentForm {...mockProps} /></TestWrapper>);
    expect(screen.getByText('150€')).toBeInTheDocument();
  });

  it('should calculate deposit correctly', () => {
    render(<TestWrapper><PaymentForm {...mockProps} /></TestWrapper>);
    // 30% deposit
    expect(screen.getByText('45€')).toBeInTheDocument();
  });

  it('should show error message when payment fails', async () => {
    const mockError = 'Payment failed';
    vi.spyOn(StripeService.prototype, 'confirmPayment').mockRejectedValue(new Error(mockError));
    
    render(<TestWrapper><PaymentForm {...mockProps} /></TestWrapper>);
    
    const submitButton = screen.getByText(/payer/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onError).toHaveBeenCalledWith(mockError);
    });
  });

  it('should call onSuccess when payment succeeds', async () => {
    vi.spyOn(StripeService.prototype, 'confirmPayment').mockResolvedValue({
      id: 'pi_123',
      status: 'succeeded'
    } as any);
    
    render(<TestWrapper><PaymentForm {...mockProps} /></TestWrapper>);
    
    const submitButton = screen.getByText(/payer/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should validate terms acceptance', async () => {
    render(<TestWrapper><PaymentForm {...mockProps} /></TestWrapper>);
    
    const submitButton = screen.getByText(/payer/i);
    const termsCheckbox = screen.getByRole('checkbox');
    
    fireEvent.click(submitButton);
    expect(mockProps.onError).not.toHaveBeenCalled();
    
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/veuillez accepter les conditions/i)).not.toBeInTheDocument();
    });
  });

  it('should handle card element errors', async () => {
    render(<TestWrapper><PaymentForm {...mockProps} /></TestWrapper>);
    
    const cardElement = screen.getByLabelText(/carte bancaire/i);
    fireEvent.change(cardElement, {
      error: { message: 'Numéro de carte invalide' }
    });
    
    await waitFor(() => {
      expect(screen.getByText(/numéro de carte invalide/i)).toBeInTheDocument();
    });
  });
});