import React from "react";
import Sidebar from "../sidebar/Sidebar";
import {
  Menu,
  Star,
  MoreHorizontal,
  Share2,
  Plus,
  ChevronDown,
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  User,
  Check,
  ChevronRight,
  Trash2,
} from "lucide-react";
import BoardView from "../../components/projectBoard/BoardView";
import TableView from "../../components/projectBoard/TableView";
import CalendarView from "../../components/projectBoard/CalendarView";
import TimelineView from "../../components/projectBoard/TimelineView";
import TaskDetailModal from '../../components/task/TaskDetailModal';
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
  type DropdownItem,
  ProjectBoardSkeleton,
  KanbanBoardSkeleton,
  TableSkeleton,
} from "../../components/ui";

const ProjectBoard: React.FC = () => {
  const {
    // Data
    projects,
    activeProject,
    projectTasks,
    selectedTask,
    tabs,

    // Loading states
    isLoading,
    tasksLoading,

    // UI States
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

    // Setters
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

    // Handlers
    handleCreateProject,
    handleOpenTemplateLibrary,
    handleSelectTemplate,
    handleSwitchProject,
    handleEditTask,
    handleTableTaskClick,
    handleAddTask,
    handleOpenAddEvent,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteProject,
  } = useProjectBoard();

  const renderContent = () => {
    // Show skeleton while loading
    if (tasksLoading) {
      switch (activeTab) {
        case 'Board':
          return <KanbanBoardSkeleton />;
        case 'Table':
          return <TableSkeleton />;
        default:
          return <KanbanBoardSkeleton />;
      }
    }

    switch (activeTab) {
      case 'Board':
        return <BoardView tasks={projectTasks} onTaskClick={setSelectedTask} onAddTask={handleAddTask} />;
      case 'Table':
        return <TableView tasks={projectTasks} onTaskClick={handleTableTaskClick} />;
      case 'Calendar':
        return <CalendarView projectId={activeProject?.id} />;
      case 'Timeline':
        return <TimelineView projectId={activeProject?.id} />;
      case 'Dashboard':
        return (
          <div className={projectboardClasses.dashboardWrapper}>
            <h2 className={projectboardClasses.dashboardTitle}>Project Teams</h2>
            <div className="text-gray-500">
              {activeProject?.members && activeProject.members.length > 0 ? (
                <div className={projectboardClasses.membersGrid}>
                  {activeProject.members.map((member) => (
                    <div key={member.id} className={projectboardClasses.memberCard}>
                      <div className={projectboardClasses.memberAvatar}>
                        {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : (member.name?.[0] || 'U')}
                      </div>
                      <div>
                        <p className={projectboardClasses.memberName}>{member.name}</p>
                        <p className={projectboardClasses.memberRole}>Project Member</p>
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

  // Show full page skeleton if initial loading
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
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className={projectboardClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </Button>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className={projectboardClasses.main}>
        <div className={projectboardClasses.mainContent(sidebarOpen)}>

          {/* Header Top Row */}
          <div className={projectboardClasses.headerWrapper}>
            {/* Title & Status */}
            <div className={projectboardClasses.headerTitleWrapper}>
              <div className={projectboardClasses.headerMenuWrapper}>
                <Dropdown
                  trigger={
                    <div className={projectboardClasses.headerTitleClickable}>
                      <h1 className={projectboardClasses.headerTitle}>{activeProject?.name || "No Projects"}</h1>
                    </div>
                  }
                  items={[
                    { key: 'switch-header', label: 'Switch Project', header: true },
                    ...projects.map(p => ({
                      key: p.id,
                      label: (
                        <div className="flex items-center justify-between w-full">
                          <span className={projectboardClasses.dropdownItemText}>{p.name}</span>
                          {activeProject?.id === p.id && <Check size={14} />}
                        </div>
                      ),
                      onClick: () => handleSwitchProject(p)
                    })),
                    { key: 'div1', divider: true } as DropdownItem,
                    {
                      key: 'create-new',
                      label: 'Create New Project',
                      icon: <Plus size={14} />,
                      onClick: () => setIsCreateModalOpen(true)
                    }
                  ]}
                />

                <Star className={projectboardClasses.starIcon} size={18} />

                <div className="relative">
                  <Dropdown
                    align="right"
                    trigger={
                      <button className={projectboardClasses.menuIconButton}>
                        <MoreHorizontal className={projectboardClasses.menuIconColor} size={18} />
                      </button>
                    }
                    items={[
                      {
                        key: 'active-header',
                        custom: true,
                        label: (
                          <div className={projectboardClasses.menuDropdownHeader}>
                            <p className={projectboardClasses.menuDropdownLabel}>Active Project</p>
                            <p className={projectboardClasses.menuDropdownValue}>{activeProject?.name || "None"}</p>
                          </div>
                        )
                      },
                      { key: 'switch', label: 'Switch Project', icon: <ChevronRight size={14} />, onClick: () => { /* Logic? */ } },
                      {
                        key: 'delete',
                        label: 'Delete Project',
                        danger: true,
                        icon: <Trash2 size={14} />,
                        onClick: () => {
                          if (activeProject) handleDeleteProject(activeProject.id);
                        }
                      }
                    ]}
                  />
                </div>
              </div>
              <div className={projectboardClasses.statusBadge}>
                <div className={projectboardClasses.statusDot}></div>
                <span>{activeProject?.status || "On track"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className={projectboardClasses.actionsWrapper}>
              {/* Avatars */}
              <div className={projectboardClasses.avatarsWrapper}>
                {(() => {
                  // Combine members from project and teams
                  const allMembers = [
                    ...(activeProject?.members || []),
                    ...(activeProject?.teams?.flatMap(t => t.members || []) || [])
                  ];

                  // Deduplicate by ID
                  const uniqueMembers = Array.from(new Map(allMembers.filter(m => m).map(m => [m!.id, m])).values());

                  return (
                    <>
                      {uniqueMembers.slice(0, 4).map((member, i) => (
                        <div key={member!.id || i} className={projectboardClasses.avatar}>
                          {member!.avatar ? (
                            <img src={member!.avatar} alt={member!.name} className={projectboardClasses.avatarImage} />
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
                rightIcon={<ChevronDown size={14} className={projectboardClasses.createButtonChevron} />}
              >
                <span>Create</span>
              </Button>
            </div>
          </div>

          {/* Header Bottom Row (Toolbar) */}
          <div className={projectboardClasses.toolbar}>
            {/* Tabs */}
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
              >
                <span>Add</span>
              </Button>
            </div>

            {/* Tools */}
            <div className={projectboardClasses.toolsWrapper}>
              <div
                className={projectboardClasses.toolItem}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={16} />
                <span className={projectboardClasses.toolText}>Search</span>
              </div>
              <div className={projectboardClasses.toolDivider}></div>
              <div className={projectboardClasses.toolItem}>
                <Filter size={16} />
                <span className={projectboardClasses.toolText}>Filter</span>
              </div>
              <div className={projectboardClasses.toolItem}>
                <ArrowUpDown size={16} />
                <span className={projectboardClasses.toolText}>Sort</span>
              </div>
              <div className={projectboardClasses.toolItem}>
                <SlidersHorizontal size={16} />
                <span className={projectboardClasses.toolText}>Fields</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className={projectboardClasses.contentArea}>
            {renderContent()}
          </div>

        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOpenTemplateLibrary={handleOpenTemplateLibrary}
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
        onAdd={(_event) => {
          // Events will be refreshed automatically when the calendar/timeline components fetch data
        }}
      />

      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default ProjectBoard;