import React from 'react';
import {
    X,
    Share2,
    Star,
    Link,
    MoreHorizontal,
    CheckCircle2,
    Calendar,
    Plus,
    FileText,
    File,
    ChevronRight,
    ChevronsRight
} from 'lucide-react';
import type { Task } from '../../types';

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
    if (!isOpen || !task) return null;

    return (
        <div className={`fixed inset-0 z-50 bg-black/20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div
                className={`fixed right-0 top-0 h-full bg-white shadow-2xl w-[500px] overflow-y-auto flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Top Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2 text-gray-400">
                        <button className="hover:text-gray-600"><ChevronsRight size={18} /></button>
                        <button className="hover:text-gray-600 text-gray-400"><CheckCircle2 size={18} /></button>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500">
                        <button className="hover:text-gray-700"><Star size={16} /></button>
                        <button className="hover:text-gray-700"><Link size={16} /></button>
                        <button className="hover:text-gray-700"><MoreHorizontal size={16} /></button>
                        <button onClick={onClose} className="hover:text-red-500">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 pb-8">
                    {/* Title */}
                    <h1 className="text-xl font-bold text-gray-900 mb-6">
                        {task.name || 'Reporting: Design concept of visual dashboard'}
                    </h1>

                    {/* Properties Grid */}
                    <div className="grid grid-cols-[100px_1fr] gap-y-4 mb-6 text-sm">
                        {/* Status */}
                        <div className="text-gray-500 py-1">Status</div>
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-500 text-white text-sm font-medium">
                                In progress
                            </span>
                            {/* Wait, image uses a simple text with green dot, usually a dropdown. 
                                Let's match image: Green Dot + "In progress" text, maybe generic container. 
                            */}
                            <div className="inline-flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="text-gray-700 font-medium">In progress</span>
                            </div>
                        </div>

                        {/* Assignee */}
                        <div className="text-gray-500 py-1">Assignee</div>
                        <div className="flex items-center gap-2">
                            <img
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                alt="Assignee"
                                className="w-6 h-6 rounded-full border border-gray-200"
                            />
                            <span className="text-gray-700 font-medium">Eugeniusz Rymaszewski</span>
                        </div>

                        {/* Priority */}
                        <div className="text-gray-500 py-1">Priority</div>
                        <div>
                            <span className="inline-block px-3 py-0.5 rounded bg-emerald-100 text-emerald-600 text-xs font-medium">
                                Low
                            </span>
                        </div>

                        {/* Due Date */}
                        <div className="text-gray-500 py-1">Due date</div>
                        <div className="text-gray-700 font-medium py-1">
                            Oct 24
                        </div>

                        {/* Tags */}
                        <div className="text-gray-500 py-1">Tags</div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs font-medium">design</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">web</span>
                        </div>
                    </div>

                    {/* Add Custom Field */}
                    <button className="text-gray-500 hover:text-gray-800 text-sm font-medium mb-6">
                        Add custom field
                    </button>

                    {/* Divider - Show 2 empty fields */}
                    <div className="relative flex py-4 items-center mb-5">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-300 text-xs text-center w-full absolute">Show 2 empty fields</span>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                        <p className="text-gray-800 leading-relaxed text-sm">
                            This task involves updating the time page to handle empty weeks, implementing changes for time off, and making some minor adjustments. It's currently in progress, with a high priority, and is part of the Clickup project. The task is assigned to Yauhen Rymasheuski and includes a subtask titled "Time page: part I.
                        </p>
                    </div>

                    {/* Attachments */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-medium text-gray-500">Attachments</h3>
                            <span className="text-gray-300 text-xs">· 2</span>
                        </div>
                        <div className="flex gap-3">
                            {/* PDF Card */}
                            <div className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg min-w-[160px] hover:bg-gray-50 cursor-pointer">
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-500">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-gray-700">Profile@2x.pdf</div>
                                    <div className="text-[10px] text-gray-400">PDF-Download</div>
                                </div>
                            </div>
                            {/* Docx Card */}
                            <div className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg min-w-[160px] hover:bg-gray-50 cursor-pointer">
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-500">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-gray-700">Zaswidczenie.docx</div>
                                    <div className="text-[10px] text-gray-400">Doc file-Download</div>
                                </div>
                            </div>
                            {/* Add Attachment */}
                            <div className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer">
                                <Plus size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-medium text-gray-500">Subtasks-2</h3>
                        </div>
                        <div className="space-y-1">
                            {/* Subtask 1 */}
                            <div className="flex items-center justify-between group py-2 hover:bg-gray-50 px-2 -mx-2 rounded">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-gray-300 hover:text-green-500 cursor-pointer" />
                                    <span className="text-sm text-gray-800">Reporting: Design concept of visual dashboard</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">Aug 23</span>
                                    <img src="https://i.pravatar.cc/150?u=1" className="w-5 h-5 rounded-full" />
                                </div>
                            </div>
                            {/* Subtask 2 */}
                            <div className="flex items-center justify-between group py-2 hover:bg-gray-50 px-2 -mx-2 rounded">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-gray-300 hover:text-green-500 cursor-pointer" />
                                    <span className="text-sm text-gray-800">Visualization and visual dashboard</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-green-500">Today</span>
                                    <img src="https://i.pravatar.cc/150?u=2" className="w-5 h-5 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* New Subtask Input */}
                        <div className="flex items-center gap-3 mt-3 px-2">
                            <div className="w-4 h-4 rounded border border-gray-300"></div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 text-sm outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Footer Comment Input */}
                    <div className="mt-8 border border-gray-200 rounded-lg p-2 flex items-center gap-3 shadow-sm">
                        <img src="https://i.pravatar.cc/150?u=user" className="w-8 h-8 rounded-full" />
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
