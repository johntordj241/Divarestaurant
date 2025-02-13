```typescript
import { describe, it, expect } from 'vitest';
import { supabase } from '../../lib/supabase/client';
import { AuthService } from '../../lib/auth/AuthService';
import { StripeService } from '../../lib/payment/StripeService';

describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should prevent unauthorized access to admin routes', async () => {
      const response = await fetch('/api/admin/statistics');
      expect(response.status).toBe(401);
    });

    it('should enforce password complexity', async () => {
      const auth = AuthService.getInstance();
      
      // Test weak passwords
      await expect(auth.signUp('test@example.com', 'password123')).rejects.toThrow();
      await expect(auth.signUp('test@example.com', '12345678')).rejects.toThrow();
      
      // Test strong password
      const strongPassword = 'StrongP@ssw0rd2024';
      const result = await auth.signUp('test@example.com', strongPassword);
      expect(result).toBeTruthy();
    });

    it('should implement rate limiting', async () => {
      const auth = AuthService.getInstance();
      const attempts = Array(10).fill(null).map(() => 
        auth.signIn('test@example.com', 'wrongpassword')
      );
      
      await Promise.all(attempts);
      
      // Le 11ème essai devrait être bloqué
      await expect(
        auth.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow(/too many requests/i);
    });
  });

  describe('Data Protection', () => {
    it('should enforce row level security', async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', 'other-user-id');
      
      expect(error?.message).toMatch(/permission denied/i);
      expect(data).toBeNull();
    });

    it('should sanitize user input', async () => {
      const maliciousInput = `<script>alert('xss')</script>`;
      const { data } = await supabase
        .from('messages')
        .insert({ content: maliciousInput });
      
      expect(data?.content).not.toContain('<script>');
    });
  });

  describe('Payment Security', () => {
    it('should use secure payment processing', async () => {
      const stripe = StripeService.getInstance();
      const testCard = '4242424242424242';
      
      const result = await stripe.validateCard(testCard);
      expect(result.isValid).toBe(true);
      expect(result.isTestCard).toBe(true);
    });

    it('should prevent double charges', async () => {
      const stripe = StripeService.getInstance();
      const paymentId = 'test_payment_id';
      
      await stripe.processPayment(paymentId, 100);
      await expect(
        stripe.processPayment(paymentId, 100)
      ).rejects.toThrow(/payment already processed/i);
    });
  });
});
```