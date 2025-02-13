import { useState } from 'react';
import { CRMService } from '../lib/automation/CRMService';

export function useCRM() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const crm = new CRMService();

  const updateCustomer = async (customerId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await crm.updateCustomerProfile(customerId, data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update customer'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addLoyaltyPoints = async (customerId: string, points: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await crm.addLoyaltyPoints(customerId, points);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add loyalty points'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackStats = async (since: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      return await crm.getFeedbackStats(since);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get feedback stats'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateCustomer,
    addLoyaltyPoints,
    getFeedbackStats,
    isLoading,
    error
  };
}