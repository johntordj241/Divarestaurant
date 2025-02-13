describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('devrait naviguer entre les différentes sections', () => {
    cy.get('[data-testid="menu-link"]').click();
    cy.url().should('include', '#menu');

    cy.get('[data-testid="shows-link"]').click();
    cy.url().should('include', '#shows');

    cy.get('[data-testid="gallery-link"]').click();
    cy.url().should('include', '#gallery');
  });

  it('devrait ouvrir le formulaire de réservation', () => {
    cy.get('[data-testid="booking-button"]').click();
    cy.get('[data-testid="booking-form"]').should('be.visible');
  });

  it('devrait afficher le menu correctement', () => {
    cy.get('[data-testid="menu-link"]').click();
    cy.get('[data-testid="menu-category"]').should('have.length.at.least', 1);
    cy.get('[data-testid="menu-item"]').should('have.length.at.least', 1);
  });
});