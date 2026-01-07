/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      waitForApiAndUI(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="login-button"]').click();
  cy.url().should("not.include", "/login", { timeout: 10000 });
});

Cypress.Commands.add("waitForApiAndUI", () => {
  cy.wait(1000);
});

export {};
