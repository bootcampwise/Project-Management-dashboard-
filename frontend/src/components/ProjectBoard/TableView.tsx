import React from 'react';
import { ChevronRight, ChevronDown, Plus, MoreHorizontal, CheckCircle2, MessageSquare, Paperclip, User } from 'lucide-react';
import type { TableViewProps, Task } from '../../types';
import { useTableView } from '../../hooks/projectboard/useTableView';

interface ExtendedTableViewProps extends TableViewProps {
    tasks?: Task[];
}

const TableView: React.FC<ExtendedTableViewProps> = ({ onTaskClick, tasks }) => {
    const { groups, toggleGroup } = useTableView(tasks);

    return (
        <div className="flex flex-col h-full bg-white font-sans text-sm">
            {groups.map((group) => (
                <div key={group.id} className="mb-8">
                    {/* Group Header */}
                    <div className="flex items-center gap-2 mb-2 px-2 group/header">
                        <button
                            onClick={() => toggleGroup(group.id)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                        >
                            {group.isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <div className={`w-2.5 h-2.5 rounded-full bg-${group.color}-500 shadow-sm`}></div>
                        <h3 className="text-[15px] font-semibold text-gray-800">{group.title}</h3>
                        <span className="text-gray-400 font-normal ml-1">{group.count}</span>

                        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover/header:opacity-100 transition-opacity">
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Group Content */}
                    {!group.isCollapsed && (
                        <div>
                            {/* Column Headers */}
                            <div className="grid grid-cols-[1fr_180px_100px_180px_40px] gap-0 border-y border-gray-100 text-xs text-gray-500 font-normal bg-white sticky top-0 z-10">
                                <div className="px-4 py-2 border-r border-gray-100">Name</div>
                                <div className="px-4 py-2 border-r border-gray-100">Assignee</div>
                                <div className="px-4 py-2 border-r border-gray-100">Due date</div>
                                <div className="px-4 py-2 border-r border-gray-100">Label</div>
                                <div className="py-2"></div>
                            </div>

                            {/* Tasks */}
                            <div className="">
                                {group.tasks.length > 0 ? (
                                    group.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="grid grid-cols-[1fr_180px_100px_180px_40px] gap-0 hover:bg-gray-50 group/row text-[13px] cursor-pointer items-center border-b border-gray-100 transition-colors h-10"
                                            onClick={() => onTaskClick && onTaskClick(task)}
                                        >
                                            {/* Name Column */}
                                            <div className="flex items-center gap-3 px-4 h-full border-r border-gray-100 overflow-hidden">
                                                <button
                                                    className="text-gray-300 hover:text-blue-500 transition-colors flex-shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Handle toggle complete
                                                    }}
                                                >
                                                    <CheckCircle2 size={16} strokeWidth={1.5} />
                                                </button>
                                                <span className="text-gray-800 truncate font-normal">{task.name}</span>

                                                {/* Metadata icons */}
                                                <div className="flex items-center gap-3 text-gray-400 shrink-0 ml-1">
                                                    {task.comments ? (
                                                        <span className="flex items-center gap-1 text-xs hover:text-gray-600 transition-colors">
                                                            {task.comments} <MessageSquare size={12} />
                                                        </span>
                                                    ) : null}
                                                    {task.attachments ? (
                                                        <span className="flex items-center gap-1 text-xs hover:text-gray-600 transition-colors">
                                                            <Paperclip size={12} />
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Assignee Column */}
                                            <div className="flex items-center gap-2 h-full px-4 border-r border-gray-100">
                                                {!task.assignee || task.assignee.name === 'Unassigned' || !task.assignee.name ? (
                                                    <div className="flex items-center gap-2 group/assignee opacity-50 hover:opacity-100 transition-opacity">
                                                        <div className="w-5 h-5 rounded-full bg-white border border-gray-300 border-dashed flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors">
                                                            <User size={10} />
                                                        </div>
                                                    </div>
                                                ) : task.assignee.avatar ? (
                                                    <div className="flex items-center gap-2">
                                                        <img src={task.assignee.avatar} alt={task.assignee.name} className="w-5 h-5 rounded-full object-cover" />
                                                        <span className="truncate text-gray-700">{task.assignee.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold border border-blue-200">
                                                            {task.assignee.name.charAt(0)}
                                                        </div>
                                                        <span className="truncate text-gray-700">{task.assignee.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Due Date Column */}
                                            <div className="text-gray-500 h-full flex items-center px-4 border-r border-gray-100">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                            </div>

                                            {/* Label Column */}
                                            <div className="flex items-center gap-1.5 h-full px-4 border-r border-gray-100 overflow-hidden">
                                                {task.labels.map((label, idx) => {
                                                    const bgClass = label.bg && label.bg.length > 2 ? label.bg : 'bg-gray-100';
                                                    const textClass = label.color && label.color.length > 2 ? label.color : 'text-gray-600';
                                                    return (
                                                        <span key={idx} className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium leading-none ${bgClass} ${textClass} opacity-90 whitespace-nowrap`}>
                                                            {label.text}
                                                        </span>
                                                    );
                                                })}
                                            </div>

                                            {/* Add/Actions Column */}
                                            <div className="flex justify-center items-center h-full">
                                                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover/row:opacity-100 transition-all p-1 rounded hover:bg-gray-200">
                                                    <MoreHorizontal size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-2 px-4 text-[13px] text-gray-400 border-b border-gray-100 italic bg-gray-50/30">
                                        No tasks.
                                    </div>
                                )}
                            </div>

                            {/* Add Task Row */}
                            <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 py-1.5 items-center px-4 text-[13px] group/add w-full text-left transition-colors -mt-px relative z-[1]">
                                <Plus size={14} className="group-hover/add:text-blue-500 transition-colors" />
                                <span className="group-hover/add:text-gray-800 transition-colors">Add task...</span>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TableView;
