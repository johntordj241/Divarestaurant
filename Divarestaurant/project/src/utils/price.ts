import { MenuItem } from '../types';

export const calculateMenuTotal = (menuItems: MenuItem[], numberOfGuests: number) => {
  return menuItems.reduce((total, item) => total + item.price, 0) * numberOfGuests;
};

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};