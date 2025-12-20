import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/index';
import { Menu, Search, Filter, ArrowUpDown, Plus, Calendar, MessageSquare, Paperclip, FileText, Layout, List } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskDetailModal from '../components/ProjectBoard/TaskDetailModal';
import CreateTaskModal from '../components/ProjectBoard/CreateTaskModal';
import BoardColumn from '../components/ProjectBoard/BoardColumn';
import { useTasksPage } from '../hooks/useTasksPage';

import { DragDropContext } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { updateTaskStatus } from '../store/slices/taskSlice';

const Tasks: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        sidebarOpen,
        setSidebarOpen,
        activeView,
        setActiveView,
        tasks,
        getPriorityColor,
    } = useTasks();

    const {
        selectedTask,
        taskToEdit,
        isCreateTaskModalOpen,
        modalInitialStatus,
        handleTaskClick,
        handleOpenCreateTask,
        handleCreateTask,
        handleEditTask,
        handleUpdateTask,
        closeTaskDetail,
        closeCreateTaskModal
    } = useTasksPage();

    // Initial column configuration with visibility state
    const [columns, setColumns] = useState([
        { id: 'BACKLOG', title: 'Backlog', color: 'bg-gray-400', collapsed: false, isVisible: true },
        { id: 'TODO', title: 'Todo', color: 'bg-blue-500', collapsed: false, isVisible: true },
        { id: 'IN_PROGRESS', title: 'In progress', color: 'bg-green-500', collapsed: false, isVisible: true },
        { id: 'IN_REVIEW', title: 'In Review', color: 'bg-purple-500', collapsed: false, isVisible: true },
        { id: 'QA', title: 'QA', color: 'bg-yellow-500', collapsed: false, isVisible: true },
        { id: 'COMPLETED', title: 'Completed', color: 'bg-indigo-500', collapsed: false, isVisible: true },
        { id: 'POSTPONE', title: 'Postpone', color: 'bg-red-400', collapsed: true, isVisible: true },
        { id: 'CANCELED', title: 'Canceled', color: 'bg-gray-500', collapsed: false, isVisible: true },
    ]);

    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    const handleToggleColumn = (columnId: string) => {
        setColumns(prev => prev.map(col =>
            col.id === columnId ? { ...col, collapsed: !col.collapsed } : col
        ));
    };

    const handleHideColumn = (columnId: string) => {
        setColumns(prev => prev.map(col =>
            col.id === columnId ? { ...col, isVisible: false } : col
        ));
    };

    const handleShowColumn = (columnId: string) => {
        setColumns(prev => prev.map(col =>
            col.id === columnId ? { ...col, isVisible: true } : col
        ));
        setIsAddSectionOpen(false);
    };

    const visibleColumns = columns.filter(col => col.isVisible);
    const hiddenColumns = columns.filter(col => !col.isVisible);

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
                        <DragDropContext onDragEnd={(result) => {
                            const { destination, source, draggableId } = result;

                            if (!destination) return;

                            if (
                                destination.droppableId === source.droppableId &&
                                destination.index === source.index
                            ) {
                                return;
                            }

                            const newStatus = destination.droppableId;
                            dispatch(updateTaskStatus({ id: draggableId, status: newStatus }));

                        }}>
                            <div className="p-6 h-full overflow-x-auto">
                                <div className="flex h-full w-full gap-4 pb-4">
                                    {visibleColumns.map((col) => (
                                        <div
                                            key={col.id}
                                            className={`h-full transition-all duration-300 ${col.collapsed ? 'w-12 min-w-[48px]' : 'flex-1 min-w-0'}`}
                                        >
                                            <BoardColumn
                                                title={col.title}
                                                count={getTasksByStatus(col.id).length}
                                                color={col.color}
                                                tasks={getTasksByStatus(col.id)}
                                                status={col.id}
                                                collapsed={col.collapsed}
                                                onTaskClick={handleTaskClick}
                                                onAddTask={(status) => handleOpenCreateTask(status)}
                                                onToggle={() => handleToggleColumn(col.id)}
                                                onHide={() => handleHideColumn(col.id)}
                                            />
                                        </div>
                                    ))}

                                    {/* Add Section Button & Dropdown */}
                                    <div className="relative min-w-[120px] pt-1">
                                        <button
                                            onClick={() => setIsAddSectionOpen(!isAddSectionOpen)}
                                            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium whitespace-nowrap"
                                        >
                                            <Plus size={16} />
                                            <span>Add section</span>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isAddSectionOpen && hiddenColumns.length > 0 && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setIsAddSectionOpen(false)}
                                                />
                                                <div className="absolute left-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                                    {hiddenColumns.map(col => (
                                                        <button
                                                            key={col.id}
                                                            onClick={() => handleShowColumn(col.id)}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                                                            {col.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {isAddSectionOpen && hiddenColumns.length === 0 && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setIsAddSectionOpen(false)}
                                                />
                                                <div className="absolute left-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-2 px-4 text-sm text-gray-500">
                                                    All sections visible
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DragDropContext>
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
                                    {visibleColumns.flatMap((column) =>
                                        getTasksByStatus(column.id).map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => handleTaskClick(task)}
                                                className="grid grid-cols-[2fr_1fr_1fr_120px_100px_150px] gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer items-center text-sm min-w-[800px]"
                                            >
                                                {/* Task Name */}
                                                <div>
                                                    <div className="font-medium text-gray-900 mb-1">{task.title || task.name}</div>
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
                                                        {(typeof task.comments === 'number' ? task.comments : task.comments?.length || 0) > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare size={11} />
                                                                <span>{typeof task.comments === 'number' ? task.comments : task.comments?.length}</span>
                                                            </div>
                                                        )}
                                                        {(typeof task.attachments === 'number' ? task.attachments : task.attachments?.length || 0) > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Paperclip size={11} />
                                                                <span>{typeof task.attachments === 'number' ? task.attachments : task.attachments?.length}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Project */}
                                                <div className="text-blue-600 text-xs font-medium">
                                                    {typeof task.project === 'string' ? task.project : task.project?.name || '-'}
                                                </div>

                                                {/* Assignee */}
                                                <div className="flex -space-x-2">
                                                    {(task.assignees || []).map((assignee, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden"
                                                            title={assignee.name}
                                                        >
                                                            {assignee.avatar ? (
                                                                <img
                                                                    src={assignee.avatar}
                                                                    alt={assignee.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                (assignee.name || 'U').charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Due Date */}
                                                <div className="flex items-center gap-1 text-gray-600 text-xs">
                                                    {task.dueDate ? (
                                                        <>
                                                            <Calendar size={12} />
                                                            <span>
                                                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>

                                                {/* Priority */}
                                                <div>
                                                    {task.priority && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                            {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                                                        </span>
                                                    )}
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
                onEdit={handleEditTask}
            />

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                initialStatus={modalInitialStatus}
                onClose={closeCreateTaskModal}
                onCreate={handleCreateTask}
                task={taskToEdit}
                onUpdate={handleUpdateTask}
            />
        </div>
    );
};

export default Tasks;
