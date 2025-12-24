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

const ProjectBoard: React.FC = () => {
  const {
    // Data
    projects,
    activeProject,
    projectTasks,
    selectedTask,
    tabs,

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
    isProjectDropdownOpen,
    isMenuDropdownOpen,

    // Setters
    setSidebarOpen,
    setActiveTab,
    setIsCreateModalOpen,
    setIsTeamModalOpen,
    setIsTemplateLibraryOpen,
    setIsSearchOpen,
    setIsCreateTaskModalOpen,
    setIsAddEventModalOpen,
    setIsProjectDropdownOpen,
    setIsMenuDropdownOpen,
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

  return (
    <div className={projectboardClasses.container}>
      {/* Mobile menu button */}
      <button
        className={projectboardClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

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
                <div
                  className={projectboardClasses.headerTitleClickable}
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                >
                  <h1 className={projectboardClasses.headerTitle}>{activeProject?.name || "No Projects"}</h1>
                </div>

                {/* Project Switcher Dropdown */}
                {isProjectDropdownOpen && (
                  <div className={projectboardClasses.dropdown}>
                    <div className={projectboardClasses.dropdownHeader}>
                      Switch Project
                    </div>
                    {projects.map(p => (
                      <button
                        key={p.id}
                        className={projectboardClasses.dropdownItem(activeProject?.id === p.id)}
                        onClick={() => handleSwitchProject(p)}
                      >
                        <span className={projectboardClasses.dropdownItemText}>{p.name}</span>
                        {activeProject?.id === p.id && <Check size={14} />}
                      </button>
                    ))}
                    {projects.length === 0 && (
                      <div className={projectboardClasses.dropdownEmpty}>No projects found</div>
                    )}
                    <div className={projectboardClasses.dropdownDivider}>
                      <button
                        className={projectboardClasses.dropdownCreateButton}
                        onClick={() => {
                          setIsProjectDropdownOpen(false);
                          setIsCreateModalOpen(true);
                        }}
                      >
                        <Plus size={14} />
                        Create New Project
                      </button>
                    </div>
                  </div>
                )}

                <Star className={projectboardClasses.starIcon} size={18} />

                <div className="relative">
                  <button
                    className={projectboardClasses.menuIconButton}
                    onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                  >
                    <MoreHorizontal className={projectboardClasses.menuIconColor} size={18} />
                  </button>

                  {/* Menu Dropdown */}
                  {isMenuDropdownOpen && (
                    <div className={projectboardClasses.menuDropdown}>
                      <div className={projectboardClasses.menuDropdownHeader}>
                        <p className={projectboardClasses.menuDropdownLabel}>Active Project</p>
                        <p className={projectboardClasses.menuDropdownValue}>{activeProject?.name || "None"}</p>
                      </div>
                      <button
                        className={projectboardClasses.menuDropdownItem}
                        onClick={() => {
                          setIsMenuDropdownOpen(false);
                          setIsProjectDropdownOpen(true);
                        }}
                      >
                        <ChevronRight size={14} />
                        Switch Project
                      </button>
                      <button
                        className={projectboardClasses.menuDropdownDeleteItem}
                        onClick={() => {
                          setIsMenuDropdownOpen(false);
                          if (activeProject) handleDeleteProject(activeProject.id);
                        }}
                      >
                        <Trash2 size={14} />
                        Delete Project
                      </button>
                    </div>
                  )}
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

              <button className={projectboardClasses.shareButton}>
                <Share2 size={16} />
                <span className="text-sm">Share</span>
              </button>
              <button
                className={projectboardClasses.createButton}
                onClick={() => setIsCreateModalOpen(true)}
              >
                <span>Create</span>
                <ChevronDown size={14} className={projectboardClasses.createButtonChevron} />
              </button>
            </div>
          </div>

          {/* Header Bottom Row (Toolbar) */}
          <div className={projectboardClasses.toolbar}>
            {/* Tabs */}
            <div className={projectboardClasses.tabsWrapper}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={projectboardClasses.tab(activeTab === tab.id)}
                >
                  <tab.icon size={16} />
                  <span>{tab.id}</span>
                </button>
              ))}
              <button
                type="button"
                className={projectboardClasses.addTabButton}
                onClick={handleOpenAddEvent}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
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
        onAdd={(event) => {
          console.log('Event created:', event);
          // Events will be refreshed automatically when the calendar/timeline components fetch data
        }}
      />

      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default ProjectBoard;