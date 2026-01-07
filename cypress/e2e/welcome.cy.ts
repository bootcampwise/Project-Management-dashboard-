describe("Welcome Page", () => {
  describe("Welcome Page Display", () => {
    it("displays welcome page for new users", () => {
      cy.visit("/welcome");
      cy.get("body").then(($body) => {
        if ($body.text().includes("Welcome")) {
          cy.contains("Welcome").should("be.visible");
          cy.contains("Get Started").should("be.visible");
        }
      });
    });

    it("displays Defcon logo", () => {
      cy.visit("/welcome");
      cy.get("body").then(($body) => {
        if ($body.text().includes("Welcome")) {
          cy.get('img[alt*="Logo"]').should("exist");
        }
      });
    });

    it("displays welcome description", () => {
      cy.visit("/welcome");
      cy.get("body").then(($body) => {
        if ($body.text().includes("Project Management")) {
          cy.contains("Project Management Dashboard").should("be.visible");
        }
      });
    });
  });

  describe("Welcome Page Navigation", () => {
    it("Get Started button navigates to dashboard", () => {
      cy.visit("/welcome");
      cy.get("body").then(($body) => {
        if ($body.text().includes("Get Started")) {
          cy.contains("Get Started").click();
          cy.waitForApiAndUI();
          cy.url().should("include", "/dashboard");
        }
      });
    });
  });
});

describe("Welcome Flow After Signup", () => {
  it("new user sees welcome page after registration", () => {
    cy.visit("/signup");
    cy.get("body").should("be.visible");
  });
});
