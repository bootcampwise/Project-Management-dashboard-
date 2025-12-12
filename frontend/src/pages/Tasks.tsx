import React from 'react';
import Sidebar from '../components/Sidebar/index';
import { Menu, Search, Filter, ArrowUpDown, Plus, MoreHorizontal, Calendar, MessageSquare, Paperclip, FileText, Layout, List } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskDetailModal from '../components/ProjectBoard/TaskDetailModal';
import CreateTaskModal from '../components/ProjectBoard/CreateTaskModal';

import { useTasksPage } from '../hooks/useTasksPage';

const Tasks: React.FC = () => {
    const {
        sidebarOpen,
        setSidebarOpen,
        activeView,
        setActiveView,
        columns,
        getPriorityColor,
    } = useTasks();

    const {
        selectedTask,
        isCreateTaskModalOpen,
        modalInitialStatus,
        handleTaskClick,
        handleOpenCreateTask,
        handleCreateTask,
        closeTaskDetail,
        closeCreateTaskModal
    } = useTasksPage();

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
            <main className="flex-1 overflow-y-auto bg-white">
                <div className={`flex-1 flex flex-col transition-all duration-300 ${!sidebarOpen ? 'pt-16 md:pt-0 md:pl-16' : ''}`}>
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tasks</h1>

                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Left: View Tabs */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveView('kanban')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${activeView === 'kanban'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Layout size={16} />
                                    Kanban
                                </button>
                                <button
                                    onClick={() => setActiveView('list')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${activeView === 'list'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <List size={16} />
                                    List
                                </button>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <Search size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-500">Search</span>
                                </div>
                                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                                    <Filter size={16} />
                                    Filters
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                                    <ArrowUpDown size={16} />
                                    Sort by
                                </button>
                                <button
                                    onClick={() => handleOpenCreateTask()}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    New Task
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Kanban Board */}
                    {activeView === 'kanban' ? (
                        <div className="p-6 h-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                                {columns.map((column) => (
                                    <div key={column.id} className="flex flex-col min-w-0">
                                        {/* Column Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: column.color }}
                                                />
                                                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="text-gray-400 hover:text-gray-600"
                                                    onClick={() => handleOpenCreateTask(column.title)}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Task Cards */}
                                        <div className="space-y-3 overflow-y-auto">
                                            {column.tasks.map((task) => (
                                                <div
                                                    key={task.id}
                                                    onClick={() => handleTaskClick(task)}
                                                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    {/* Project Tag */}
                                                    {task.project && (
                                                        <div className="text-xs text-blue-600 mb-2 font-medium">
                                                            {task.project}
                                                        </div>
                                                    )}

                                                    {/* Title */}
                                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                                                        {task.title}
                                                    </h4>

                                                    {/* Description */}
                                                    {task.description && (
                                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}

                                                    {/* Assignees */}
                                                    <div className="flex items-center mb-3">
                                                        <div className="flex -space-x-2">
                                                            {(task.assignees || []).map((avatar, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={avatar}
                                                                    alt="Assignee"
                                                                    className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar size={12} />
                                                                <span>{task.dueDate}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                                                        {typeof task.subtasks === 'number' && task.subtasks > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <FileText size={12} />
                                                                <span>{task.subtasks}</span>
                                                            </div>
                                                        )}
                                                        {(task.comments || 0) > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare size={12} />
                                                                <span>{task.comments}</span>
                                                            </div>
                                                        )}
                                                        {(task.attachments || 0) > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Paperclip size={12} />
                                                                <span>{task.attachments}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* List View */
                        <div className="p-6">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                                {/* Table Header */}
                                <div className="grid grid-cols-[2fr_1fr_1fr_120px_100px_150px] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700 min-w-[800px]">
                                    <div>Task Name</div>
                                    <div>Project</div>
                                    <div>Assignee</div>
                                    <div>Due Date</div>
                                    <div>Priority</div>
                                    <div>Status</div>
                                </div>

                                {/* Table Rows */}
                                <div className="divide-y divide-gray-100">
                                    {columns.flatMap((column) =>
                                        column.tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => handleTaskClick(task)}
                                                className="grid grid-cols-[2fr_1fr_1fr_120px_100px_150px] gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer items-center text-sm min-w-[800px]"
                                            >
                                                {/* Task Name */}
                                                <div>
                                                    <div className="font-medium text-gray-900 mb-1">{task.title}</div>
                                                    {task.description && (
                                                        <div className="text-xs text-gray-500 line-clamp-1">{task.description}</div>
                                                    )}
                                                    {/* Stats */}
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                        {typeof task.subtasks === 'number' && task.subtasks > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <FileText size={11} />
                                                                <span>{task.subtasks}</span>
                                                            </div>
                                                        )}
                                                        {(task.comments || 0) > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare size={11} />
                                                                <span>{task.comments}</span>
                                                            </div>
                                                        )}
                                                        {(task.attachments || 0) > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Paperclip size={11} />
                                                                <span>{task.attachments}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Project */}
                                                <div className="text-blue-600 text-xs font-medium">{task.project || '-'}</div>

                                                {/* Assignee */}
                                                <div className="flex -space-x-2">
                                                    {(task.assignees || []).map((avatar, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={avatar}
                                                            alt="Assignee"
                                                            className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Due Date */}
                                                <div className="flex items-center gap-1 text-gray-600 text-xs">
                                                    <Calendar size={12} />
                                                    <span>{task.dueDate}</span>
                                                </div>

                                                {/* Priority */}
                                                <div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>

                                                {/* Status */}
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: column.color }}
                                                    />
                                                    <span className="text-gray-700 text-sm">{column.title}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Task Detail Modal */}
            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={closeTaskDetail}
                task={selectedTask}
            />

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                initialStatus={modalInitialStatus}
                onClose={closeCreateTaskModal}
                onCreate={handleCreateTask}
            />
        </div>
    );
};

export default Tasks;
