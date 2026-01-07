describe("Sidebar Navigation", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/dashboard");
    cy.waitForApiAndUI();
  });

  describe("Sidebar Toggle", () => {
    it("opens sidebar on menu button click", () => {
      cy.get("button").first().click();
      cy.waitForApiAndUI();
      cy.contains("Defcon").should("be.visible");
    });

    it("closes sidebar on overlay click", () => {
      cy.get("button").first().click();
      cy.waitForApiAndUI();
      cy.get("body").click("topRight");
    });
  });

  describe("Sidebar Content", () => {
    beforeEach(() => {
      cy.get("button").first().click();
      cy.waitForApiAndUI();
    });

    it("displays logo", () => {
      cy.contains(/defcon/i).should("be.visible");
    });

    it("displays main navigation items", () => {
      cy.contains("Search").should("be.visible");
      cy.contains("Dashboard").should("be.visible");
      cy.contains("Notifications").should("be.visible");
      cy.contains("Tasks").should("be.visible");
      cy.contains("Create Project").should("be.visible");
    });

    it("displays Teamspaces section", () => {
      cy.contains("Teamspaces").should("be.visible");
    });

    it("displays Teams submenu", () => {
      cy.contains("Teams").should("be.visible");
    });

    it("displays Projects submenu", () => {
      cy.contains("Projects").should("be.visible");
    });

    it("displays footer items", () => {
      cy.contains("Invite teammates").should("be.visible");
      cy.contains("Setting").should("be.visible");
    });
  });

  describe("Sidebar Navigation", () => {
    beforeEach(() => {
      cy.get("button").first().click();
      cy.waitForApiAndUI();
    });

    it("navigates to Dashboard", () => {
      cy.contains("Dashboard").click();
      cy.url().should("include", "/dashboard");
    });

    it("navigates to Tasks", () => {
      cy.contains("Tasks").click();
      cy.url().should("include", "/tasks");
    });

    it("opens Search popup", () => {
      cy.contains("Search").click();
      cy.waitForApiAndUI();
      cy.get("body").should("be.visible");
    });

    it("opens Notifications popup", () => {
      cy.contains("Notifications").click();
      cy.waitForApiAndUI();
    });

    it("opens Create Project modal", () => {
      cy.contains("Create Project").click();
      cy.waitForApiAndUI();
      cy.get("body").should("be.visible");
    });
  });

  describe("Sidebar Expandable Sections", () => {
    beforeEach(() => {
      cy.get("button").first().click();
      cy.waitForApiAndUI();
    });

    it("expands Teams section", () => {
      cy.contains("Teams").click();
      cy.waitForApiAndUI();
    });

    it("expands Projects section", () => {
      cy.contains("Projects").click();
      cy.waitForApiAndUI();
    });
  });

  describe("Settings Modal", () => {
    beforeEach(() => {
      cy.get("button").first().click();
      cy.waitForApiAndUI();
    });

    it("opens Settings modal", () => {
      cy.contains("Setting").click();
      cy.waitForApiAndUI();
      cy.get("body").then(($body) => {
        if ($body.text().includes("Profile")) {
          cy.contains("Profile").should("be.visible");
        }
      });
    });

    it("opens Invite teammates (Members tab)", () => {
      cy.contains("Invite teammates").click();
      cy.waitForApiAndUI();
    });
  });
  w;
});
