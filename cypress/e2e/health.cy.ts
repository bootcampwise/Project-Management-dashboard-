describe("Application Health Check", () => {
  it("loads login page successfully", () => {
    cy.visit("/login");
    cy.contains("Log in to your account").should("be.visible");
    cy.get('[data-cy="email-input"]').should("be.visible");
    cy.get('[data-cy="password-input"]').should("be.visible");
    cy.get('[data-cy="login-button"]').should("be.visible");
  });

  it("loads signup page successfully", () => {
    cy.visit("/signup");
    cy.contains("Create an account").should("be.visible");
  });

  it("redirects unauthenticated users from protected routes", () => {
    cy.visit("/dashboard");
    cy.url().should("satisfy", (url: string) => {
      return (
        url.includes("/login") ||
        url.includes("/signup") ||
        url.includes("/welcome")
      );
    });
  });

  it("backend API is reachable", () => {
    cy.request({
      url: "http://localhost:3001/api/health",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 404, 401]);
    });
  });
});
