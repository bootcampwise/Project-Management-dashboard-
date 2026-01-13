import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  pageVariants,
  reducedPageVariants,
  itemVariants,
} from "../../utils/motion";
import Sidebar from "../sidebar/Sidebar";
import {
  Menu,
  Star,
  MoreHorizontal,
  Share2,
  Plus,
  ChevronDown,
  Search,
  SlidersHorizontal,
  User,
  ChevronRight,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import BoardView from "../../components/projectBoard/BoardView";
import TableView from "../../components/projectBoard/TableView";
import CalendarView from "../../components/projectBoard/CalendarView";
import TimelineView from "../../components/projectBoard/TimelineView";
import TaskDetailModal from "../../components/task/TaskDetailModal";
import CreateProjectModal from "../../components/projectBoard/CreateProjectModal";
import CreateTeamModal from "../../components/team/CreateTeamModal";
import TemplateLibraryModal from "../../components/projectBoard/TemplateLibraryModal";
import SearchPopup from "../../components/sidebar/SearchPopup";
import CreateTaskModal from "../../components/task/CreateTaskModal";
import AddEventModal from "../../components/projectBoard/AddEventModal";
import { useProjectBoard } from "./hooks/useProjectBoard";
import { projectboardClasses } from "./projectboardStyle";
import {
  Button,
  Dropdown,
  ProjectBoardSkeleton,
  KanbanBoardSkeleton,
  TableSkeleton,
} from "../../components/ui";
import SortControl from "../../components/ui/SortControl";
import FilterControl from "../../components/ui/FilterControl";

const ProjectBoard: React.FC = () => {
  const {
    user,
    activeProject,
    projectTasks,
    selectedTask,
    tabs,
    isLoading,
    tasksLoading,
    sidebarOpen,
    activeTab,
    isCreateModalOpen,
    isTeamModalOpen,
    isTemplateLibraryOpen,
    isSearchOpen,
    isCreateTaskModalOpen,
    isAddEventModalOpen,
    modalInitialStatus,
    taskToEdit,
    setSidebarOpen,
    setActiveTab,
    setIsCreateModalOpen,
    setIsTeamModalOpen,
    setIsTemplateLibraryOpen,
    setIsSearchOpen,
    setIsCreateTaskModalOpen,
    setIsAddEventModalOpen,
    setSelectedTask,
    setTaskToEdit,
    handleCreateProject,
    handleOpenTemplateLibrary,
    handleSelectTemplate,
    handleEditTask,
    handleDeleteTask,
    handleTableTaskClick,
    handleAddTask,
    handleOpenAddEvent,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteProject,
    handleUpdateProjectStatus,
    hasTeams,
  } = useProjectBoard();

  const shouldReduceMotion = useReducedMotion();

  const [sortBy, setSortBy] = React.useState<"newest" | "oldest" | "alpha">(
    "newest",
  );
  const [filterPriority, setFilterPriority] = React.useState<string | null>(
    null,
  );
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = React.useState(false);
  const statusDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [visibleFields, setVisibleFields] = React.useState<
    Record<string, boolean>
  >({
    assignee: true,
    dueDate: true,
    label: true,
  });

  const toggleField = (field: string) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const filteredAndSortedTasks = React.useMemo(() => {
    let tasks = [...projectTasks];

    if (filterPriority) {
      tasks = tasks.filter((t) => t.priority === filterPriority);
    }

    const getCreationTime = (t: (typeof tasks)[0]) => {
      if (t.createdAt) return new Date(t.createdAt).getTime();
      if (t.updatedAt) return new Date(t.updatedAt).getTime();
      return 0;
    };

    return tasks.sort((a, b) => {
      if (sortBy === "alpha") {
        const nameA = a.name || a.title || "";
        const nameB = b.name || b.title || "";
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "oldest") {
        return getCreationTime(a) - getCreationTime(b);
      }
      return getCreationTime(b) - getCreationTime(a);
    });
  }, [projectTasks, filterPriority, sortBy]);

  const isTeamMember = React.useMemo(() => {
    return activeProject?.members?.some((m) => m.id === user?.id) || false;
  }, [activeProject, user]);

  const renderContent = () => {
    if (tasksLoading) {
      switch (activeTab) {
        case "Board":
          return <KanbanBoardSkeleton />;
        case "Table":
          return <TableSkeleton />;
        default:
          return <KanbanBoardSkeleton />;
      }
    }

    switch (activeTab) {
      case "Board":
        return (
          <BoardView
            tasks={filteredAndSortedTasks}
            onTaskClick={setSelectedTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
            visibleFields={visibleFields}
            cardVariant="detailed"
            currentUserId={user?.id}
            isTeamMember={isTeamMember}
          />
        );
      case "Table":
        return (
          <TableView
            tasks={filteredAndSortedTasks}
            onTaskClick={handleTableTaskClick}
            visibleFields={visibleFields}
            onAddTask={isTeamMember ? handleAddTask : undefined}
          />
        );
      case "Calendar":
        return <CalendarView projectId={activeProject?.id} />;
      case "Timeline":
        return <TimelineView projectId={activeProject?.id} />;
      case "Dashboard":
        return (
          <div className={projectboardClasses.dashboardWrapper}>
            <h2 className={projectboardClasses.dashboardTitle}>
              Project Teams
            </h2>
            <div className="text-gray-500">
              {activeProject?.members && activeProject.members.length > 0 ? (
                <div className={projectboardClasses.membersGrid}>
                  {activeProject.members.map((member) => (
                    <div
                      key={member.id}
                      className={projectboardClasses.memberCard}
                    >
                      <div className={projectboardClasses.memberAvatar}>
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.name?.[0] || "U"
                        )}
                      </div>
                      <div>
                        <p className={projectboardClasses.memberName}>
                          {member.name}
                        </p>
                        <p className={projectboardClasses.memberRole}>
                          Project Member
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No teams or members assigned to this project yet.</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={projectboardClasses.container}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={projectboardClasses.main}>
          <div className={projectboardClasses.mainContent(sidebarOpen)}>
            <ProjectBoardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={projectboardClasses.container}>
      <Button
        variant="ghost"
        className={projectboardClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </Button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={projectboardClasses.main}>
        <motion.div
          className={projectboardClasses.mainContent(sidebarOpen)}
          variants={shouldReduceMotion ? reducedPageVariants : pageVariants}
          initial="initial"
          animate="animate"
        >
          <div className={projectboardClasses.headerWrapper}>
            <div className={projectboardClasses.headerTitleWrapper}>
              <div className={projectboardClasses.headerMenuWrapper}>
                <div className={projectboardClasses.headerTitleClickable}>
                  <h1 className={projectboardClasses.headerTitle}>
                    {activeProject?.name || "No Projects"}
                  </h1>
                </div>

                <Star className={projectboardClasses.starIcon} size={18} />

                <div className="relative">
                  <Dropdown
                    align="left"
                    trigger={
                      <button className={projectboardClasses.menuIconButton}>
                        <MoreHorizontal
                          className={projectboardClasses.menuIconColor}
                          size={18}
                        />
                      </button>
                    }
                    items={[
                      {
                        key: "active-header",
                        custom: true,
                        label: (
                          <div
                            className={projectboardClasses.menuDropdownHeader}
                          >
                            <p
                              className={projectboardClasses.menuDropdownLabel}
                            >
                              Active Project
                            </p>
                            <p
                              className={projectboardClasses.menuDropdownValue}
                            >
                              {activeProject?.name || "None"}
                            </p>
                          </div>
                        ),
                      },
                      {
                        key: "switch",
                        label: "Switch Project",
                        icon: <ChevronRight size={14} />,
                        onClick: () => {},
                      },
                      ...(isTeamMember
                        ? [
                            {
                              key: "delete",
                              label: "Delete Project",
                              danger: true,
                              icon: <Trash2 size={14} />,
                              onClick: () => {
                                if (activeProject)
                                  handleDeleteProject(activeProject.id);
                              },
                            },
                          ]
                        : []),
                    ]}
                  />
                </div>
              </div>
              <div className="relative" ref={statusDropdownRef}>
                <div
                  className={`${projectboardClasses.statusBadge} ${isTeamMember ? "cursor-pointer hover:opacity-80" : "cursor-default"} transition-opacity`}
                  onClick={() =>
                    isTeamMember &&
                    setIsStatusDropdownOpen(!isStatusDropdownOpen)
                  }
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeProject?.status === "COMPLETED"
                        ? "bg-emerald-500"
                        : activeProject?.status === "ON_HOLD"
                          ? "bg-yellow-500"
                          : activeProject?.status === "CANCELED"
                            ? "bg-red-500"
                            : "bg-green-500"
                    }`}
                  ></div>
                  <span>{activeProject?.status || "ACTIVE"}</span>
                  <ChevronDown size={14} className="ml-1" />
                </div>

                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    {[
                      {
                        value: "ACTIVE",
                        label: "Active",
                        color: "bg-green-500",
                      },
                      {
                        value: "ON_HOLD",
                        label: "On Hold",
                        color: "bg-yellow-500",
                      },
                      {
                        value: "COMPLETED",
                        label: "Completed",
                        color: "bg-emerald-500",
                      },
                      {
                        value: "CANCELED",
                        label: "Canceled",
                        color: "bg-red-500",
                      },
                    ].map((status) => (
                      <button
                        key={status.value}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          activeProject?.status === status.value
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => {
                          handleUpdateProjectStatus(status.value);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${status.color}`}
                        ></div>
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={projectboardClasses.actionsWrapper}>
              <div className={projectboardClasses.avatarsWrapper}>
                {(() => {
                  const allMembers = [
                    ...(activeProject?.members || []),
                    ...(activeProject?.teams?.flatMap((t) => t.members || []) ||
                      []),
                  ];

                  const uniqueMembers = Array.from(
                    new Map(
                      allMembers.filter((m) => m).map((m) => [m!.id, m]),
                    ).values(),
                  );

                  return (
                    <>
                      {uniqueMembers.slice(0, 4).map((member, i) => (
                        <div
                          key={member!.id || i}
                          className={projectboardClasses.avatar}
                        >
                          {member!.avatar ? (
                            <img
                              src={member!.avatar}
                              alt={member!.name}
                              className={projectboardClasses.avatarImage}
                            />
                          ) : (
                            <div className={projectboardClasses.avatarFallback}>
                              {member!.name?.[0] || <User size={16} />}
                            </div>
                          )}
                        </div>
                      ))}
                      {uniqueMembers.length > 4 && (
                        <div className={projectboardClasses.avatarOverflow}>
                          +{uniqueMembers.length - 4}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <Button
                variant="secondary"
                className={projectboardClasses.shareButton}
                leftIcon={<Share2 size={16} />}
              >
                <span className="text-sm">Share</span>
              </Button>
              <Button
                variant="primary"
                className={projectboardClasses.createButton}
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!hasTeams}
                title={!hasTeams ? "Create a team first" : "Create Project"}
                rightIcon={
                  <ChevronDown
                    size={14}
                    className={projectboardClasses.createButtonChevron}
                  />
                }
              >
                <span>Create</span>
              </Button>
            </div>
          </div>

          <div className={projectboardClasses.toolbar}>
            <div className={projectboardClasses.tabsWrapper}>
              {tabs.map((tab) => (
                <Button
                  variant="ghost"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={projectboardClasses.tab(activeTab === tab.id)}
                  leftIcon={<tab.icon size={16} />}
                >
                  <span>{tab.id}</span>
                </Button>
              ))}
              <Button
                variant="ghost"
                type="button"
                className={projectboardClasses.addTabButton}
                onClick={handleOpenAddEvent}
                leftIcon={<Plus size={16} />}
                disabled={!isTeamMember}
                title={
                  !isTeamMember ? "You are not a member of this project" : "Add"
                }
              >
                <span>Add</span>
              </Button>
            </div>

            <div className={projectboardClasses.toolsWrapper}>
              <div
                className={projectboardClasses.toolItem}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={16} />
                <span className={projectboardClasses.toolText}>Search</span>
              </div>
              <div className={projectboardClasses.toolDivider}></div>
              <FilterControl
                value={filterPriority}
                onChange={setFilterPriority}
                label="Filter"
                options={[
                  { key: "all", label: "All", value: null },
                  { key: "urgent", label: "Urgent", value: "URGENT" },
                  { key: "high", label: "High", value: "HIGH" },
                  { key: "medium", label: "Medium", value: "MEDIUM" },
                  { key: "low", label: "Low", value: "LOW" },
                ]}
              />
              <SortControl
                value={sortBy}
                onChange={(val) =>
                  setSortBy(val as "newest" | "oldest" | "alpha")
                }
                options={[
                  { key: "newest", label: "Newest" },
                  { key: "oldest", label: "Oldest" },
                  { key: "alpha", label: "A-Z" },
                ]}
              />
              <Dropdown
                align="right"
                trigger={
                  <div className={projectboardClasses.toolItem}>
                    <SlidersHorizontal size={16} />
                    <span className={projectboardClasses.toolText}>Fields</span>
                  </div>
                }
                items={[
                  { key: "header", label: "Toggle Columns", header: true },
                  {
                    key: "assignee",
                    label: (
                      <div className="flex items-center justify-between w-full">
                        <span>Assignee</span>
                        {visibleFields.assignee ? (
                          <Eye size={14} className="text-blue-500" />
                        ) : (
                          <EyeOff size={14} className="text-gray-400" />
                        )}
                      </div>
                    ),
                    onClick: () => toggleField("assignee"),
                  },
                  {
                    key: "dueDate",
                    label: (
                      <div className="flex items-center justify-between w-full">
                        <span>Due Date</span>
                        {visibleFields.dueDate ? (
                          <Eye size={14} className="text-blue-500" />
                        ) : (
                          <EyeOff size={14} className="text-gray-400" />
                        )}
                      </div>
                    ),
                    onClick: () => toggleField("dueDate"),
                  },
                  {
                    key: "label",
                    label: (
                      <div className="flex items-center justify-between w-full">
                        <span>Labels</span>
                        {visibleFields.label ? (
                          <Eye size={14} className="text-blue-500" />
                        ) : (
                          <EyeOff size={14} className="text-gray-400" />
                        )}
                      </div>
                    ),
                    onClick: () => toggleField("label"),
                  },
                ]}
              />
            </div>
          </div>

          <motion.div
            className={projectboardClasses.contentArea}
            variants={itemVariants}
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOpenTemplateLibrary={handleOpenTemplateLibrary}
        onOpenTeamModal={() => {
          setIsCreateModalOpen(false);
          setIsTeamModalOpen(true);
        }}
        onCreate={handleCreateProject}
      />

      <CreateTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      <TemplateLibraryModal
        isOpen={isTemplateLibraryOpen}
        onClose={() => {
          setIsTemplateLibraryOpen(false);
          setIsCreateModalOpen(true);
        }}
        onSelectTemplate={handleSelectTemplate}
      />

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onEdit={handleEditTask}
        isTeamMember={isTeamMember}
      />

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        initialStatus={modalInitialStatus}
        task={taskToEdit}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
      />

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        projectId={activeProject?.id}
        onAdd={(_event) => {}}
      />

      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        showProjects={true}
      />
    </div>
  );
};

export default ProjectBoard;
