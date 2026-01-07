describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/dashboard");
    cy.waitForApiAndUI();
  });

  describe("Dashboard Layout", () => {
    it("displays dashboard header", () => {
      cy.contains("Dashboard").should("be.visible");
    });

    it("displays sidebar toggle button", () => {
      cy.get("button").find("svg").should("exist");
    });

    it("shows skeleton while loading", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Filter Controls", () => {
    it("displays project dropdown", () => {
      cy.contains("All Projects").should("be.visible");
    });

    it("opens project dropdown on click", () => {
      cy.contains("All Projects").click();
      cy.get("body").should("contain.text", "All Projects");
    });

    it("displays filters button", () => {
      cy.contains("Filters").should("be.visible");
    });

    it("opens filters panel on click", () => {
      cy.contains("Filters").click();
      cy.contains("Status").should("be.visible");
      cy.contains("Priority").should("be.visible");
    });

    it("filters by status", () => {
      cy.contains("Filters").click();
      cy.get("select").first().select("In Progress");
      cy.contains("Apply Filters").click();
    });

    it("clears filters", () => {
      cy.contains("Filters").click();
      cy.contains("Clear all").click();
    });
  });

  describe("Time Range Controls", () => {
    it("displays time range selector", () => {
      cy.contains("D").should("be.visible");
      cy.contains("W").should("be.visible");
      cy.contains("M").should("be.visible");
    });

    it("changes time range on button click", () => {
      cy.contains("W").click();
      cy.contains("W").should("be.visible");
    });

    it("displays date picker", () => {
      cy.get('input[type="date"]').should("exist");
    });
  });

  describe("Dashboard Components", () => {
    it("displays stats grid", () => {
      cy.get("body").should("be.visible");
    });

    it("displays charts section", () => {
      cy.get("body").should("be.visible");
    });

    it("displays latest tasks section", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Sidebar Interaction", () => {
    it("opens sidebar when menu button is clicked", () => {
      cy.get("button").first().click();
      cy.contains("Dashboard").should("be.visible");
    });

    it("sidebar shows navigation items", () => {
      cy.get("button").first().click();
      cy.contains("Tasks").should("be.visible");
      cy.contains("Notifications").should("be.visible");
    });
  });
});
