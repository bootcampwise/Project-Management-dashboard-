import React, { useState } from "react";
import Sidebar from "../components/Sidebar/index";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setActiveProject } from "../store/slices/projectSlice";
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
    LogOut,
    Settings,
    ChevronRight,
} from "lucide-react";
import BoardView from "../components/ProjectBoard/BoardView";
import TableView from "../components/ProjectBoard/TableView";
import CalendarView from "../components/ProjectBoard/CalendarView";
import TimelineView from "../components/ProjectBoard/TimelineView";
import TaskDetailModal from '../components/ProjectBoard/TaskDetailModal';
import CreateProjectModal from "../components/ProjectBoard/CreateProjectModal";
import CreateTeamModal from "../components/ProjectBoard/CreateTeamModal";
import TemplateLibraryModal from "../components/ProjectBoard/TemplateLibraryModal";
import SearchPopup from "../components/SearchPopup";
import CreateTaskModal from "../components/ProjectBoard/CreateTaskModal";
import AddEventModal from "../components/ProjectBoard/AddEventModal";
import { useProjectBoard } from "../hooks/useProjectBoard";
import type { Task } from "../types";

const ProjectBoard: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { projects, activeProject } = useAppSelector(state => state.project);

    // Sync URL param with active project, or default to first project
    React.useEffect(() => {
        if (projectId) {
            const proj = projects.find(p => p.id === projectId);
            if (proj && proj.id !== activeProject?.id) {
                dispatch(setActiveProject(proj));
            }
        } else if (!activeProject && projects.length > 0) {
            dispatch(setActiveProject(projects[0]));
        }
    }, [projectId, projects, activeProject, dispatch]);

    const project = activeProject;

    const {
        sidebarOpen,
        setSidebarOpen,
        activeTab,
        setActiveTab,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isTeamModalOpen,
        setIsTeamModalOpen,
        isTemplateLibraryOpen,
        setIsTemplateLibraryOpen,
        selectedTask,
        setSelectedTask,
        tabs,
        handleOpenTemplateLibrary,
        handleSelectTemplate,
    } = useProjectBoard();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [modalInitialStatus, setModalInitialStatus] = useState<string | undefined>(undefined);

    // Header Dropdown States
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

    const handleSwitchProject = (p: typeof projects[0]) => {
        dispatch(setActiveProject(p));
        setIsProjectDropdownOpen(false);
        navigate(`/project/${p.id}`);
    };

    // Convert TableTask to Task for the detail modal
    const handleTableTaskClick = (tableTask: { id: string; name: string; assignee: { name: string; avatar?: string }; dueDate: string; labels: { text: string; color: string; bg: string }[]; comments?: number; attachments?: number }) => {
        // Convert TableTask to Task by adding missing required properties
        const task: Task = {
            id: tableTask.id,
            name: tableTask.name,
            project: project?.name || 'Default Project', // Use actual project name
            subtasks: 0, // TableTask doesn't track subtasks
            status: 'In Progress', // Default status
            priority: 'Medium', // Default priority
            startDate: new Date().toISOString().split('T')[0],
            endDate: tableTask.dueDate,
            dueDate: tableTask.dueDate,
            labels: tableTask.labels,
            assignee: tableTask.assignee,
            comments: tableTask.comments,
            attachments: tableTask.attachments,
        };
        setSelectedTask(task);
    };

    const handleAddTask = (status: string) => {
        setModalInitialStatus(status);
        setIsCreateTaskModalOpen(true);
    };

    const handleOpenAddEvent = () => {
        console.log("Opening Add Event Modal");
        setIsAddEventModalOpen(true);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Board':
                return <BoardView onTaskClick={setSelectedTask} onAddTask={handleAddTask} />;
            case 'Table':
                return <TableView onTaskClick={handleTableTaskClick} />;
            case 'Calendar':
                return <CalendarView />;
            case 'Timeline':
                return <TimelineView />;
            case 'Dashboard':
                return (
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Project Teams</h2>
                        <div className="text-gray-500">
                            {project?.members && project.members.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.members.map((member) => (
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
        }
    };

    return (
        <div className="flex h-screen bg-white relative font-sans">
            {/* Mobile menu button (and Desktop re-open button) */}
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
                                    <h1 className="text-xl font-bold text-gray-800">{project?.name || "No Projects"}</h1>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
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
                                                <p className="text-sm font-medium text-gray-800 truncate">{project?.name || "None"}</p>
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
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <Settings size={14} />
                                                Project Settings
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>{project?.status || "On track"}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Avatars */}
                            <div className="flex -space-x-2 mr-2">
                                {(project?.members || []).slice(0, 4).map((member, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium overflow-hidden">
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                                {member.name?.[0] || <User size={16} />}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(project?.members?.length || 0) > 4 && (
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                                        +{(project?.members?.length || 0) - 4}
                                    </div>
                                )}
                            </div>

                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 bg-white">
                                <Share2 size={16} />
                                <span>Share</span>
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
            />

            <CreateTeamModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
            />

            <TemplateLibraryModal
                isOpen={isTemplateLibraryOpen}
                onClose={() => {
                    setIsTemplateLibraryOpen(false);
                    setIsCreateModalOpen(true); // Re-open project modal on close (back navigation)
                }}
                onSelectTemplate={handleSelectTemplate}
            />

            {/* Task Detail Modal */}
            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => setIsCreateTaskModalOpen(false)}
                initialStatus={modalInitialStatus}
                onCreate={(task) => console.log('New task created:', task)}
            />

            {/* Add Event Modal */}
            <AddEventModal
                isOpen={isAddEventModalOpen}
                onClose={() => setIsAddEventModalOpen(false)}
                onAdd={(event) => console.log('New event:', event)}
            />

            <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
};
export default ProjectBoard;