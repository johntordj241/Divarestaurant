```typescript
import { test } from 'vitest';
import { supabase } from '../../lib/supabase/client';

test('should handle multiple concurrent reservations', async () => {
  const numberOfRequests = 100;
  const concurrentUsers = 20;
  
  const makeReservation = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        date: '2024-03-01',
        time: '19:00',
        number_of_guests: 2,
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        customer_phone: '+33600000000',
        menu_ids: ['menu-1'],
        status: 'pending'
      });
      
    return { data, error };
  };

  // Simulate concurrent users
  const requests = Array(numberOfRequests).fill(null).map(() => makeReservation());
  const results = await Promise.all(requests);
  
  // Verify results
  const errors = results.filter(r => r.error);
  expect(errors.length).toBe(0);
});

test('should handle high traffic on menu page', async () => {
  const numberOfRequests = 500;
  
  const getMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');
    return { data, error };
  };

  const requests = Array(numberOfRequests).fill(null).map(() => getMenuItems());
  const results = await Promise.all(requests);
  
  const errors = results.filter(r => r.error);
  expect(errors.length).toBe(0);
});
```