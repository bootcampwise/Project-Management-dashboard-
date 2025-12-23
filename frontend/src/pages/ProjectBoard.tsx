import React from "react";
import Sidebar from "../components/Sidebar/index";
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
import BoardView from "../components/ProjectBoard/BoardView";
import TableView from "../components/ProjectBoard/TableView";
import CalendarView from "../components/ProjectBoard/CalendarView";
import TimelineView from "../components/ProjectBoard/TimelineView";
import TaskDetailModal from '../components/task/TaskDetailModal';
import CreateProjectModal from "../components/ProjectBoard/CreateProjectModal";
import CreateTeamModal from "../components/Team/CreateTeamModal";
import TemplateLibraryModal from "../components/ProjectBoard/TemplateLibraryModal";
import SearchPopup from "../components/SearchPopup";
import CreateTaskModal from "../components/task/CreateTaskModal";
import AddEventModal from "../components/ProjectBoard/AddEventModal";
import { useProjectBoard } from "../hooks/projectboard/useProjectBoard";

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
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Project Teams</h2>
                        <div className="text-gray-500">
                            {activeProject?.members && activeProject.members.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeProject.members.map((member) => (
                                        <div key={member.id} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                                {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : (member.name?.[0] || 'U')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{member.name}</p>
                                                <p className="text-xs text-gray-500">Project Member</p>
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
        <div className="flex h-screen bg-white relative font-sans">
            {/* Mobile menu button */}
            <button
                className={`absolute top-4 left-4 z-30 p-2 bg-white rounded-md shadow ${sidebarOpen ? 'md:hidden' : 'block'}`}
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={22} />
            </button>

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-white flex flex-col">
                <div className={`transition-all duration-300 flex-1 flex flex-col ${!sidebarOpen ? 'pt-16 md:pt-0 md:pl-16' : ''}`}>

                    {/* Header Top Row */}
                    <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Title & Status */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 relative">
                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors"
                                    onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                                >
                                    <h1 className="text-xl font-bold text-gray-800">{activeProject?.name || "No Projects"}</h1>
                                </div>

                                {/* Project Switcher Dropdown */}
                                {isProjectDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Switch Project
                                        </div>
                                        {projects.map(p => (
                                            <button
                                                key={p.id}
                                                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${activeProject?.id === p.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                                onClick={() => handleSwitchProject(p)}
                                            >
                                                <span className="truncate">{p.name}</span>
                                                {activeProject?.id === p.id && <Check size={14} />}
                                            </button>
                                        ))}
                                        {projects.length === 0 && (
                                            <div className="px-3 py-2 text-sm text-gray-500 italic">No projects found</div>
                                        )}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
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

                                <Star className="text-yellow-400 fill-current ml-2" size={18} />

                                <div className="relative">
                                    <button
                                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                                    >
                                        <MoreHorizontal className="text-gray-400" size={18} />
                                    </button>

                                    {/* Menu Dropdown */}
                                    {isMenuDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-xs text-gray-500">Active Project</p>
                                                <p className="text-sm font-medium text-gray-800 truncate">{activeProject?.name || "None"}</p>
                                            </div>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                onClick={() => {
                                                    setIsMenuDropdownOpen(false);
                                                    setIsProjectDropdownOpen(true);
                                                }}
                                            >
                                                <ChevronRight size={14} />
                                                Switch Project
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>{activeProject?.status || "On track"}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Avatars */}
                            {/* Avatars */}
                            <div className="flex -space-x-2 mr-2">
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
                                                <div key={member!.id || i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium overflow-hidden">
                                                    {member!.avatar ? (
                                                        <img src={member!.avatar} alt={member!.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                                            {member!.name?.[0] || <User size={16} />}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {uniqueMembers.length > 4 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                                                    +{uniqueMembers.length - 4}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 bg-white">
                                <Share2 size={16} />
                                <span className="text-sm">Share</span>
                            </button>
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-700"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                <span>Create</span>
                                <ChevronDown size={14} className="border-l border-blue-500 pl-1 ml-1 h-4 w-auto" />
                            </button>
                        </div>
                    </div>

                    {/* Header Bottom Row (Toolbar) */}
                    <div className="px-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'border-gray-800 text-gray-800'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    <span>{tab.id}</span>
                                </button>
                            ))}
                            <button
                                type="button"
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium py-3 ml-2 cursor-pointer"
                                onClick={handleOpenAddEvent}
                            >
                                <Plus size={16} />
                                <span>Add</span>
                            </button>
                        </div>

                        {/* Tools */}
                        <div className="flex items-center gap-4 py-2">
                            <div
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search size={16} />
                                <span className="text-sm">Search</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300 mx-1"></div>
                            <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                                <Filter size={16} />
                                <span className="text-sm">Filter</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                                <ArrowUpDown size={16} />
                                <span className="text-sm">Sort</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                                <SlidersHorizontal size={16} />
                                <span className="text-sm">Fields</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 bg-white overflow-x-auto">
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