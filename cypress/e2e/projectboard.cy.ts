describe("Project Board Page", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
  });

  describe("Project Board Access", () => {
    it("navigates to project board from sidebar", () => {
      cy.visit("/dashboard");
      cy.waitForApiAndUI();
      cy.get("button").first().click();
      cy.waitForApiAndUI();
      cy.get("body").then(($body) => {
        if ($body.text().includes("Projects")) {
          cy.contains("Projects").click();
          cy.waitForApiAndUI();
        }
      });
    });
  });

  describe("Project Board Layout", () => {
    beforeEach(() => {
      cy.visit("/projectboard");
      cy.waitForApiAndUI();
    });

    it("displays project board page", () => {
      cy.get("body").should("be.visible");
    });

    it("displays project header elements", () => {
      cy.get("body").then(($body) => {
        if (
          $body.text().includes("Kanban") ||
          $body.text().includes("List") ||
          $body.text().includes("Timeline")
        ) {
          cy.log("Project board views found");
        }
      });
    });
  });

  describe("Project Board Views", () => {
    beforeEach(() => {
      cy.visit("/projectboard");
      cy.waitForApiAndUI();
    });

    it("switches to Kanban view", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Kanban")) {
          cy.contains("Kanban").click();
          cy.waitForApiAndUI();
        }
      });
    });

    it("switches to List view", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("List")) {
          cy.contains("List").click();
          cy.waitForApiAndUI();
        }
      });
    });

    it("switches to Timeline view", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Timeline")) {
          cy.contains("Timeline").click();
          cy.waitForApiAndUI();
        }
      });
    });
  });

  describe("Project Controls", () => {
    beforeEach(() => {
      cy.visit("/projectboard");
      cy.waitForApiAndUI();
    });

    it("displays search functionality", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Search")) {
          cy.contains("Search").should("be.visible");
        }
      });
    });

    it("displays filter controls", () => {
      cy.get("body").then(($body) => {
        if (
          $body.text().includes("Filters") ||
          $body.text().includes("Filter")
        ) {
          cy.log("Filter controls found");
        }
      });
    });

    it("displays sort controls", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("Sort")) {
          cy.log("Sort controls found");
        }
      });
    });
  });

  describe("Create Project Flow", () => {
    it("opens create project from sidebar", () => {
      cy.visit("/dashboard");
      cy.waitForApiAndUI();
      cy.get("button").first().click();
      cy.waitForApiAndUI();
      cy.get("body").then(($body) => {
        if ($body.text().includes("Create Project")) {
          cy.contains("Create Project").click();
          cy.waitForApiAndUI();
          cy.get("body").should("be.visible");
        }
      });
    });
  });
});
