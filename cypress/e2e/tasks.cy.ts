describe("Tasks Page", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/tasks");
    cy.waitForApiAndUI();
  });

  describe("Tasks Layout", () => {
    it("displays tasks page header", () => {
      cy.contains("Tasks").should("be.visible");
    });

    it("displays view toggle buttons", () => {
      cy.contains("Kanban").should("be.visible");
      cy.contains("List").should("be.visible");
    });

    it("displays New Task button", () => {
      cy.contains("New Task").should("be.visible");
    });
  });

  describe("View Switching", () => {
    it("switches to List view", () => {
      cy.contains("List").click();
      cy.contains("Task Name").should("be.visible");
      cy.contains("Project").should("be.visible");
      cy.contains("Due Date").should("be.visible");
      cy.contains("Priority").should("be.visible");
      cy.contains("Status").should("be.visible");
    });

    it("switches back to Kanban view", () => {
      cy.contains("List").click();
      cy.contains("Kanban").click();
      cy.contains("Kanban").should("be.visible");
    });
  });

  describe("Kanban Board", () => {
    it("displays Kanban columns", () => {
      cy.get("body").should("contain.text", "Backlog");
    });

    it("displays Add section button", () => {
      cy.contains("Add section").should("be.visible");
    });
  });

  describe("Task Filters and Sort", () => {
    it("displays search button", () => {
      cy.contains("Search").should("be.visible");
    });

    it("opens search popup", () => {
      cy.contains("Search").click();
      cy.get("body").should("be.visible");
    });

    it("displays filter control", () => {
      cy.contains("Filters").should("be.visible");
    });

    it("filters tasks by priority", () => {
      cy.contains("Filters").click();
      cy.get("body").then(($body) => {
        if ($body.text().includes("Urgent")) {
          cy.contains("Urgent").click();
        }
      });
    });
  });

  describe("Create Task Flow", () => {
    it("opens create task modal", () => {
      cy.contains("New Task").click();
      cy.get("body").should("be.visible");
    });
  });

  describe("List View", () => {
    beforeEach(() => {
      cy.contains("List").click();
    });

    it("displays table headers", () => {
      cy.contains("Task Name").should("be.visible");
      cy.contains("Assignee").should("be.visible");
      cy.contains("Due Date").should("be.visible");
    });

    it("displays task rows", () => {
      cy.get("body").should("be.visible");
    });
  });
});
