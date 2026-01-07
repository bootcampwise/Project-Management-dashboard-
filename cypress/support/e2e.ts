/// <reference types="cypress" />

import "./commands";

Cypress.on("uncaught:exception", () => {
  return false;
});
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      waitForApiAndUI(): Chainable<void>;
    }
  }
}
