import { MenuCheck, FilterCheck } from '../../types/validation';

export function checkMenuPresentation(): MenuCheck {
  return {
    hasDescriptions: checkMenuDescriptions(),
    hasPrices: checkMenuPrices(),
    hasImages: checkMenuImages(),
    categoriesOrganized: checkMenuCategories()
  };
}

export function checkFilters(): FilterCheck {
  return {
    vegetarian: checkFilter('vegetarian'),
    glutenFree: checkFilter('gluten-free'),
    halal: checkFilter('halal'),
    kosher: checkFilter('kosher')
  };
}

function checkMenuDescriptions(): boolean {
  const menuItems = document.querySelectorAll('.menu-item');
  return Array.from(menuItems).every(item => !!item.querySelector('.description'));
}

function checkMenuPrices(): boolean {
  const menuItems = document.querySelectorAll('.menu-item');
  return Array.from(menuItems).every(item => !!item.querySelector('.price'));
}

function checkMenuImages(): boolean {
  const menuItems = document.querySelectorAll('.menu-item');
  return Array.from(menuItems).every(item => !!item.querySelector('img'));
}

function checkMenuCategories(): boolean {
  const categories = document.querySelectorAll('.menu-category');
  return categories.length > 0;
}

function checkFilter(type: string): boolean {
  return !!document.querySelector(`[data-filter="${type}"]`);
}