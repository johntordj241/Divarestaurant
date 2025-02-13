describe('Système de réservation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="booking-button"]').click();
  });

  it('devrait permettre de faire une réservation complète', () => {
    // Étape 1: Date et invités
    cy.get('[data-testid="date-input"]').type('2024-02-01');
    cy.get('[data-testid="guests-input"]').type('4');
    cy.get('[data-testid="next-button"]').click();

    // Étape 2: Sélection du menu
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="next-button"]').click();

    // Étape 3: Informations client
    cy.get('[data-testid="name-input"]').type('Jean Dupont');
    cy.get('[data-testid="email-input"]').type('jean@example.com');
    cy.get('[data-testid="phone-input"]').type('+33612345678');
    cy.get('[data-testid="next-button"]').click();

    // Étape 4: Confirmation
    cy.get('[data-testid="confirm-button"]').click();

    // Vérification de la confirmation
    cy.get('[data-testid="confirmation-message"]')
      .should('be.visible')
      .and('contain', 'Réservation confirmée');
  });

  it('devrait afficher des erreurs pour les champs requis', () => {
    cy.get('[data-testid="next-button"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('devrait calculer correctement le prix total', () => {
    cy.get('[data-testid="date-input"]').type('2024-02-01');
    cy.get('[data-testid="guests-input"]').type('2');
    cy.get('[data-testid="next-button"]').click();

    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="total-price"]').should('contain', '170');
  });
});