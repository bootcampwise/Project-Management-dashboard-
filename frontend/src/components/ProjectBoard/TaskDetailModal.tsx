import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
    X,
    Star,
    Link,
    MoreHorizontal,
    CheckCircle2,
    Plus,
    FileText,
    ChevronsRight,
    Download,
    Send,
    Edit,
    Trash2
} from 'lucide-react';
import type { Task, User, Attachment, SubTask, Comment } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getTaskDetails, fetchTasks } from '../../store/slices/taskSlice';
import { apiClient } from '../../lib/apiClient';
import { supabase } from '../../lib/supabase';


interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onEdit?: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task: initialTask, onEdit }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { tasks } = useAppSelector((state) => state.task);

    // Get the latest task data from Redux, falling back to the initial prop
    const task = tasks.find(t => String(t.id) === String(initialTask?.id)) || initialTask;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleDeleteTask = () => {
        if (!task) return;

        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[250px]">
                <div>
                    <h3 className="font-medium text-gray-900">Delete Task?</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Are you sure you want to delete <span className="font-semibold">{task.name}</span>?
                    </p>
                </div>
                <div className="flex items-center justify-end gap-3 mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await apiClient.delete(`/tasks/${task.id}`);
                                dispatch(fetchTasks());
                                toast.success('Task deleted successfully');
                                onClose();
                            } catch (error) {
                                console.error('Failed to delete task:', error);
                                toast.error('Failed to delete task');
                            }
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: "top-center"
        });
    };

    const handleEditTask = () => {
        if (task && onEdit) {
            onEdit(task);
            setIsMenuOpen(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !task) return;

        const toastId = toast.loading('Uploading attachment...');
        try {
            // 1. Upload to Supabase
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) throw new Error("Authentication required");

            // const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = `${currentUser.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('attachments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Sync metadata with backend
            // We can now send JSON directly to the attachments endpoint
            const attachmentData = {
                taskId: String(task.id),
                name: file.name,
                url: filePath,
                size: file.size,
                mimeType: file.type
            };

            await apiClient.post('/attachments', attachmentData);

            dispatch(getTaskDetails(String(task.id)));
            toast.success('Attachment uploaded', { id: toastId });
        } catch (error: unknown) {
            console.error('Failed to upload attachment:', error);
            const message = error instanceof Error ? error.message : 'Failed to upload attachment';
            toast.error(message, { id: toastId });
        }
    };

    const handleAddSubtask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newSubtask.trim() && task) {
            try {
                await apiClient.post(`/tasks/${task.id}/subtasks`, { title: newSubtask });
                setNewSubtask('');
                dispatch(getTaskDetails(String(task.id)));
                toast.success('Subtask added');
            } catch (error) {
                console.error('Failed to add subtask:', error);
                toast.error('Failed to add subtask');
            }
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !task || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await apiClient.post(`/comments`, { taskId: String(task.id), content: newComment });
            setNewComment('');
            dispatch(getTaskDetails(String(task.id)));
            toast.success('Comment added');
        } catch (error) {
            console.error('Failed to add comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDownComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    }

    const handleAddTag = async () => {
        const tagText = prompt("Enter tag name:");
        if (tagText && task) {
            try {
                const currentTags = task.tags?.map((t: NonNullable<Task['tags']>[number]) => t.text) || [];
                await apiClient.patch(`/tasks/${task.id}`, { tags: [...currentTags, tagText] });
                dispatch(getTaskDetails(String(task.id)));
            } catch (error) {
                console.error('Failed to add tag:', error);
            }
        }
    };

    useEffect(() => {
        if (isOpen && initialTask?.id) {
            dispatch(getTaskDetails(String(initialTask.id)));
        }
    }, [isOpen, initialTask?.id, dispatch]);

    if (!isOpen || !task) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TODO': return 'bg-blue-500';
            case 'IN_PROGRESS': return 'bg-yellow-500'; // Or green per image, but sticking to app theme
            case 'COMPLETED': return 'bg-green-500';
            case 'CANCELED': return 'bg-red-500';
            case 'BACKLOG': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const formatStatus = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const handleDownload = async (e: React.MouseEvent, attachment: Attachment) => {
        e.stopPropagation();
        try {
            // Check if it's a Supabase file (has filePath or looks like a path)
            // Legacy files might be full URLs or different format, but we are moving to Supabase paths.
            // Our schema change suggests 'url' field now holds the filePath.

            // If it starts with http/https, it implies legacy or public URL
            if (attachment.url.startsWith('http')) {
                window.open(attachment.url, '_blank');
                return;
            }

            // Generate signed URL
            const { data, error } = await supabase.storage
                .from('attachments')
                .createSignedUrl(attachment.url, 60); // 1 minute expiry

            if (error) {
                console.error("Error creating signed URL:", error);
                throw error;
            }

            if (data?.signedUrl) {
                // Trigger download
                const link = document.createElement('a');
                link.href = data.signedUrl;
                link.download = attachment.name;
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success('Download started');
            }
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download file');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 bg-black/20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div
                className={`fixed right-0 top-0 h-full bg-white shadow-2xl w-[600px] overflow-y-auto flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Top Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-2 text-gray-400">
                        <button className="hover:text-gray-600 transition-colors"><ChevronsRight size={20} /></button>
                        <button className="hover:text-green-600 text-gray-400 transition-colors"><CheckCircle2 size={20} /></button>
                    </div>

                    <div className="flex items-center gap-4 text-gray-500">
                        <button className="hover:text-gray-700 transition-colors"><Star size={18} /></button>
                        <button className="hover:text-gray-700 transition-colors"><Link size={18} /></button>

                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`hover:text-gray-700 transition-colors p-1 rounded ${isMenuOpen ? 'bg-gray-100 text-gray-800' : ''}`}
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    <button
                                        onClick={handleEditTask}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit size={16} />
                                        Update Task
                                    </button>
                                    <button
                                        onClick={handleDeleteTask}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete Task
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={onClose} className="hover:text-red-500 transition-colors ml-2">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8 pb-10">
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
                        {task.name || task.title}
                    </h1>

                    {/* Properties Grid */}
                    <div className="grid grid-cols-[120px_1fr] gap-y-6 mb-8 text-sm">
                        {/* Status */}
                        <div className="text-gray-500 font-medium py-1">Status</div>
                        <div>
                            <div className="inline-flex items-center gap-2.5 px-1 py-1 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(task.status)}`}></div>
                                <span className="text-gray-700 font-medium">{formatStatus(task.status)}</span>
                            </div>
                        </div>

                        {/* Created By */}
                        <div className="text-gray-500 font-medium py-1">Created By</div>
                        <div>
                            {task.creator ? (
                                <div className="flex items-center gap-2 px-1 py-1 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                    {task.creator.avatar ? (
                                        <img
                                            src={task.creator.avatar}
                                            alt={task.creator.name}
                                            className="w-6 h-6 rounded-full border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {task.creator.name?.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-gray-700 font-medium">{task.creator.name}</span>
                                </div>
                            ) : (
                                <span className="text-gray-400 italic px-1">Unknown</span>
                            )}
                        </div>

                        {/* Assignee */}
                        <div className="text-gray-500 font-medium py-1">Assignee</div>
                        <div className="flex flex-wrap gap-2">
                            {task.assignees && task.assignees.length > 0 ? (
                                task.assignees.map((assignee: User) => (
                                    <div key={assignee.id} className="flex items-center gap-2 px-1 py-1 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                                        {assignee.avatar ? (
                                            <img
                                                src={assignee.avatar}
                                                alt={assignee.name}
                                                className="w-6 h-6 rounded-full border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {assignee.name?.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-gray-700 font-medium">{assignee.name}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-400 italic px-1">Unassigned</span>
                            )}
                        </div>

                        {/* Priority */}
                        <div className="text-gray-500 font-medium py-1">Priority</div>
                        <div>
                            <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-emerald-100 text-emerald-600'
                                }`}>
                                {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                            </span>
                        </div>

                        {/* Due Date */}
                        <div className="text-gray-500 font-medium py-1">Due date</div>
                        <div className="text-gray-700 font-medium py-1 px-1">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                        </div>

                        {/* Tags */}
                        <div className="text-gray-500 font-medium py-1">Tags</div>
                        <div className="flex flex-wrap items-center gap-2">
                            {task.tags && task.tags.map((tag: NonNullable<Task['tags']>[number]) => (
                                <span key={tag.id} className={`px-2.5 py-1 ${tag.bg || 'bg-gray-100'} ${tag.color ? `text-${tag.color}-600` : 'text-gray-600'} rounded text-xs font-medium`}>
                                    {tag.text}
                                </span>
                            ))}
                            <button onClick={handleAddTag} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Add Custom Field */}
                    <button className="text-gray-500 hover:text-gray-800 text-sm font-medium mb-8 flex items-center gap-1 transition-colors">
                        <Plus size={16} />
                        Add custom field
                    </button>

                    {/* Divider - Show empty fields */}
                    <div className="relative flex py-5 items-center mb-6 group cursor-pointer">
                        <div className="flex-grow border-t border-gray-100 group-hover:border-gray-200 transition-colors"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-300 text-xs text-center absolute left-1/2 -translate-x-1/2 bg-white px-2 group-hover:text-gray-400 transition-colors">Show empty fields</span>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Description</h3>
                        <div className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
                            {task.description || <span className="text-gray-400 italic">No description provided.</span>}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Attachments</h3>
                            <span className="text-gray-400 text-xs font-medium">· {Array.isArray(task.attachments) ? task.attachments.length : 0}</span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {Array.isArray(task.attachments) && task.attachments.map((att: Attachment) => (
                                <div
                                    key={att.id}
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl min-w-[200px] hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
                                    onClick={(e) => handleDownload(e, att)}
                                >
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-gray-700 truncate">{att.name}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">Download</div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                        <Download size={14} />
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-12 h-12 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
                            >
                                <Plus size={20} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Subtasks</h3>
                            <span className="text-gray-400 text-xs font-medium">- {Array.isArray(task.subtasks) ? task.subtasks.length : task.subtasks || 0}</span>
                        </div>
                        <div className="space-y-1">
                            {Array.isArray(task.subtasks) && task.subtasks.map((subtask: SubTask) => (
                                <div key={subtask.id} className="flex items-center justify-between group py-2.5 hover:bg-gray-50 px-3 -mx-3 rounded-lg transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className={`cursor-pointer transition-colors ${subtask.completed ? 'text-green-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                        <span className={`text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{subtask.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-gray-400">{new Date(subtask.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">U</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* New Subtask Input */}
                        <div className="flex items-center gap-3 mt-4 px-1 py-1 group">
                            <div className="w-4 h-4 rounded border border-gray-300 group-hover:border-gray-400 transition-colors"></div>
                            <input
                                type="text"
                                placeholder="Add a subtask..."
                                className="flex-1 text-sm outline-none placeholder-gray-400 bg-transparent py-1"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={handleAddSubtask}
                            />
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="pt-6 border-t border-gray-100">
                        {/* List of comments */}
                        {Array.isArray(task.comments) && task.comments.length > 0 && (
                            <div className="space-y-6 mb-8">
                                {task.comments.map((comment: Comment) => (
                                    <div key={comment.id} className="flex gap-4">
                                        {comment.author?.avatar ? (
                                            <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full mt-1" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mt-1">
                                                {(comment.author?.name || 'U').charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-gray-900">{comment.author?.name}</span>
                                                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer Comment Input */}
                        <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow focus-within:ring-1 focus-within:ring-blue-100 focus-within:border-blue-300">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                                    {(user?.name || 'Me').charAt(0)}
                                </div>
                            )}
                            <textarea
                                placeholder="Add a comment..."
                                className="flex-1 outline-none text-sm min-h-[40px] resize-none py-1.5 placeholder-gray-400"
                                rows={1}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={handleKeyDownComment}
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim() || isSubmitting}
                                className={`p-1 transition-colors ${!newComment.trim() || isSubmitting ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'}`}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
