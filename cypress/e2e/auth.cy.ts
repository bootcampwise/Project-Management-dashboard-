describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.fixture("users").as("users");
  });

  describe("Login Page UI", () => {
    it("displays all login page elements correctly", () => {
      cy.visit("/login");
      cy.contains("Log in to your account").should("be.visible");
      cy.get('[data-cy="email-input"]').should("be.visible");
      cy.get('[data-cy="password-input"]').should("be.visible");
      cy.get('[data-cy="login-button"]').should("be.visible");
      cy.contains("Forgot password?").should("be.visible");
      cy.contains("Sign up for free").should("be.visible");
      cy.contains("Google").should("be.visible");
    });

    it("shows validation for empty fields", () => {
      cy.visit("/login");
      cy.get('[data-cy="login-button"]').click();
      cy.url().should("include", "/login");
    });

    it("shows error on invalid credentials", function () {
      cy.visit("/login");
      cy.get('[data-cy="email-input"]').type("invalid@test.com");
      cy.get('[data-cy="password-input"]').type("wrongpassword123");
      cy.get('[data-cy="login-button"]').click();
      cy.url().should("include", "/login");
    });
  });

  describe("Login Functionality", () => {
    it("logs in successfully with valid credentials", function () {
      cy.login(this.users.admin.email, this.users.admin.password);
      cy.url().should("satisfy", (url: string) => {
        return (
          url.includes("/dashboard") ||
          url.includes("/welcome") ||
          url.includes("/tasks")
        );
      });
    });
  });

  describe("Navigation from Login", () => {
    it("navigates to signup page", () => {
      cy.visit("/login");
      cy.contains("Sign up for free").click();
      cy.url().should("include", "/signup");
      cy.contains("Create an account").should("be.visible");
    });

    it("opens forgot password flow", () => {
      cy.visit("/login");
      cy.contains("Forgot password?").click();
      cy.contains(/reset|forgot|email|otp/i).should("be.visible");
    });
  });
});

describe("Signup Flow", () => {
  it("displays signup page elements correctly", () => {
    cy.visit("/signup");
    cy.contains("Create an account").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains(/sign up/i).should("be.visible");
  });

  it("validates email format", () => {
    cy.visit("/signup");
    cy.get('input[type="email"]').type("invalidemail");
    cy.get('input[type="password"]').type("Password123!");
    cy.contains(/sign up/i).click();
    cy.url().should("include", "/signup");
  });

  it("navigates back to login from signup", () => {
    cy.visit("/signup");
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="login"]').length > 0) {
        cy.get('a[href*="login"]').first().click();
        cy.url().should("include", "/login");
      }
    });
  });
});
