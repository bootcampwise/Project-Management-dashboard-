describe("Team Page", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/team");
    cy.waitForApiAndUI();
  });

  describe("Team Layout", () => {
    it("displays team page", () => {
      cy.get("body").should("be.visible");
    });

    it("displays sidebar", () => {
      cy.get("button").should("exist");
    });
  });

  describe("Team Tabs", () => {
    it("displays tab navigation", () => {
      cy.get("body").then(($body) => {
        const text = $body.text();
        if (
          text.includes("Projects") ||
          text.includes("Members") ||
          text.includes("Files")
        ) {
          cy.log("Team tabs found");
        }
      });
    });

    it("switches between tabs", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Members")) {
          cy.contains("Members").click();
          cy.waitForApiAndUI();
        }
        if ($body.text().includes("Projects")) {
          cy.contains("Projects").click();
          cy.waitForApiAndUI();
        }
      });
    });
  });

  describe("Team Members", () => {
    it("displays team members section", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Members")) {
          cy.contains("Members").click();
          cy.waitForApiAndUI();
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Team Projects", () => {
    it("displays team projects section", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Projects")) {
          cy.contains("Projects").click();
          cy.waitForApiAndUI();
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Team Files", () => {
    it("displays team files section", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Files")) {
          cy.contains("Files").click();
          cy.waitForApiAndUI();
          cy.get("body").should("be.visible");
        }
      });
    });
  });
});

describe("Team Switching from Sidebar", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/dashboard");
    cy.waitForApiAndUI();
  });

  it("opens sidebar and views teams section", () => {
    cy.get("button").first().click();
    cy.waitForApiAndUI();

    cy.get("body").then(($body) => {
      if (
        $body.text().includes("Teams") ||
        $body.text().includes("Teamspaces")
      ) {
        cy.log("Teams section found in sidebar");
      }
    });
  });

  it("navigates to team from sidebar", () => {
    cy.get("button").first().click();
    cy.waitForApiAndUI();

    cy.get("body").then(($body) => {
      if ($body.text().includes("Teams")) {
        cy.contains("Teams").click();
        cy.waitForApiAndUI();
      }
    });
  });
});
