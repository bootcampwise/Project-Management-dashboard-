import React, { useState } from "react";
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
    User
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
        handleCreateProject,
        handleOpenTemplateLibrary,
        handleSelectTemplate,
    } = useProjectBoard();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [modalInitialStatus, setModalInitialStatus] = useState<string | undefined>(undefined);

    // Convert TableTask to Task for the detail modal
    const handleTableTaskClick = (tableTask: { id: string; name: string; assignee: { name: string; avatar?: string }; dueDate: string; labels: { text: string; color: string; bg: string }[]; comments?: number; attachments?: number }) => {
        // Convert TableTask to Task by adding missing required properties
        const task: Task = {
            id: tableTask.id,
            name: tableTask.name,
            project: 'Default Project', // TableTask doesn't have project info
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
            default:
                return <BoardView onTaskClick={setSelectedTask} onAddTask={handleAddTask} />;
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
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-800">Project Board [2023]</h1>
                                <Star className="text-yellow-400 fill-current" size={18} />
                                <MoreHorizontal className="text-gray-400" size={18} />
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>On track</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Avatars */}
                            <div className="flex -space-x-2 mr-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                                        <User size={16} />
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                                    +4
                                </div>
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
                onCreate={handleCreateProject}
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