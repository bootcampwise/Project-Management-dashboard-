import React from 'react';
import { ChevronRight, ChevronDown, Plus, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import type { TableViewProps, Task } from '../../types';
import { useTableView } from '../../hooks/useTableView';

interface ExtendedTableViewProps extends TableViewProps {
    tasks?: Task[];
}

const TableView: React.FC<ExtendedTableViewProps> = ({ onTaskClick, tasks }) => {
    const { groups, toggleGroup } = useTableView(tasks);

    return (
        <div className="flex flex-col h-full bg-white">
            {groups.map((group) => (
                <div key={group.id} className="mb-6">
                    {/* Group Header */}
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <button
                            onClick={() => toggleGroup(group.id)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {group.isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <div className={`w - 2.5 h - 2.5 rounded - full bg - ${group.color} -500`}></div>
                        <h3 className="text-sm font-semibold text-gray-700">{group.title}</h3>
                        <span className="text-xs text-gray-400">{group.count}</span>
                        <button className="ml-auto text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                    {/* Group Content */}
                    {!group.isCollapsed && (
                        <div>
                            {/* Column Headers */}
                            <div className="grid grid-cols-[1fr_160px_128px_160px_32px] gap-4 px-2 py-2 text-xs font-medium text-gray-500 border-b border-gray-100 mb-1">
                                <div>Name</div>
                                <div>Assignee</div>
                                <div>Due date</div>
                                <div>Label</div>
                                <div></div>
                            </div>

                            {/* Tasks */}
                            <div className="divide-y divide-gray-50">
                                {group.tasks.length > 0 ? (
                                    group.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="grid grid-cols-[1fr_160px_128px_160px_32px] gap-4 py-2.5 px-2 hover:bg-gray-50 group/row text-sm cursor-pointer items-center"
                                            onClick={() => onTaskClick && onTaskClick(task)}
                                        >
                                            {/* Name Column */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <button className="text-gray-300 hover:text-blue-500" onClick={(e) => e.stopPropagation()}>
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <span className="text-gray-800 truncate">{task.name}</span>

                                                {/* Metadata icons beside name */}
                                                <div className="flex items-center gap-2 text-gray-400 shrink-0">
                                                    {task.comments ? (
                                                        <span className="flex items-center gap-1 text-xs">
                                                            {task.comments} <span className="text-[10px]">💬</span>
                                                        </span>
                                                    ) : null}
                                                    {task.attachments ? (
                                                        <span className="flex items-center gap-1 text-xs">
                                                            {task.attachments} <span className="text-[10px]">📎</span>
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Assignee Column */}
                                            <div className="flex items-center gap-2">
                                                {task.assignee.avatar ? (
                                                    <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium border border-blue-200">
                                                        {task.assignee.name ? task.assignee.name.charAt(0) : '?'}
                                                    </div>
                                                )}
                                                <span className="text-gray-700 truncate">{task.assignee.name}</span>
                                            </div>

                                            {/* Due Date Column */}
                                            <div className="text-gray-600 text-xs">
                                                {task.dueDate}
                                            </div>

                                            {/* Label Column */}
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {task.labels.map((label, idx) => (
                                                    <span key={idx} className={`px - 2 py - 0.5 rounded text - [11px] font - medium ${label.bg} ${label.color} `}>
                                                        {label.text}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Add/Actions Column */}
                                            <div className="flex justify-end">
                                                <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover/row:opacity-100">
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-2.5 px-2 text-sm text-gray-400 pl-[46px]">
                                        No tasks in this section
                                    </div>
                                )}
                            </div>

                            {/* Add Task Row */}
                            <button className="flex items-center gap-3 text-gray-400 hover:text-gray-600 py-2 items-center px-2 mt-1 text-sm group/add w-full text-left">
                                <Plus size={18} className="group-hover/add:text-gray-600" />
                                <span>Add task</span>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TableView;
