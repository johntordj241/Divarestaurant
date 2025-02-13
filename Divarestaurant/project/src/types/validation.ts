export interface VideoCheck {
  isPlaying: boolean;
  hasCorrectDimensions: boolean;
  isResponsive: boolean;
  loadTime: number;
}

export interface NavigationCheck {
  links: {
    reservation: boolean;
    menu: boolean;
    contact: boolean;
  };
  loadTimes: Record<string, number>;
  isResponsive: boolean;
}

export interface MenuCheck {
  hasDescriptions: boolean;
  hasPrices: boolean;
  hasImages: boolean;
  categoriesOrganized: boolean;
}

export interface FilterCheck {
  vegetarian: boolean;
  glutenFree: boolean;
  halal: boolean;
  kosher: boolean;
}

export interface ReservationCheck {
  requiredFields: boolean;
  specialOptions: boolean;
  realTimeAvailability: boolean;
  validation: boolean;
}

export interface PaymentCheck {
  stripeIntegration: boolean;
  paypalIntegration: boolean;
  secureConnection: boolean;
  dataEncryption: boolean;
}

export interface ValidationReport {
  timestamp: string;
  checks: {
    homepage: {
      video: VideoCheck;
      navigation: NavigationCheck;
    };
    menu: {
      presentation: MenuCheck;
      filters: FilterCheck;
    };
    reservation: {
      form: ReservationCheck;
      payment: PaymentCheck;
    };
  };
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  component: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}