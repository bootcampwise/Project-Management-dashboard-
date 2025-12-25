import React, { useRef } from 'react';
import { showToast, Dropdown, IconButton, Tag } from "../ui";
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
  Trash2,
  UserPlus,
  Search
} from 'lucide-react';
import type { Task, User, Attachment, SubTask, Comment as AppComment, TaskDetailModalProps } from '../../types';
import { useTaskDetailModal } from '../../pages/task/hooks/useTaskDetailModal';

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task: initialTask, onEdit }) => {
  const {
    task,
    user,
    newSubtask,
    setNewSubtask,
    newComment,
    setNewComment,
    isSubmitting,

    isAddingTag,
    setIsAddingTag,
    tagInput,
    setTagInput,
    assigningSubtaskId,
    setAssigningSubtaskId,
    subtaskAssigneeSearch,
    setSubtaskAssigneeSearch,
    filteredTeamMembers,
    handleEditTask,
    deleteTask,
    handleFileChange,
    handleAddSubtask,
    handleDeleteSubtask,
    handleAssignSubtask,
    handleToggleSubtask,
    handleAddComment,
    handleTagSubmit,
    handleDownload
  } = useTaskDetailModal({ isOpen, onClose, task: initialTask, onEdit });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteTask = () => {
    if (!task) return;

    showToast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white rounded-xl shadow-lg p-4 min-w-[280px] border border-gray-100`}>
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-base">Delete Task?</h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete <span className="font-semibold text-gray-700">"{task.name}"</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => showToast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              showToast.dismiss(t.id);
              deleteTask();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center"
    });
  };

  const handleKeyDownComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  }

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



  return (
    <div className={`fixed inset-0 z-50 bg-black/20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl w-[600px] overflow-y-auto flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 text-gray-400">
            <IconButton icon={<ChevronsRight size={20} />} className="hover:text-gray-600" />
            <IconButton icon={<CheckCircle2 size={20} />} className="hover:text-green-600" />
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <IconButton icon={<Star size={18} />} className="hover:text-gray-700" />
            <IconButton icon={<Link size={18} />} className="hover:text-gray-700" />

            <div className="relative">
              <Dropdown
                align="right"
                trigger={
                  <button className="hover:text-gray-700 transition-colors p-1 rounded">
                    <MoreHorizontal size={18} />
                  </button>
                }
                items={[
                  {
                    key: 'update',
                    label: 'Update Task',
                    icon: <Edit size={16} />,
                    onClick: handleEditTask
                  },
                  {
                    key: 'delete',
                    label: 'Delete Task',
                    icon: <Trash2 size={16} />,
                    danger: true,
                    onClick: handleDeleteTask
                  }
                ]}
              />
            </div>

            <IconButton icon={<X size={20} />} onClick={onClose} className="hover:text-red-500 ml-2" />
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
                <Tag key={tag.id} text={tag.text} />
              ))}

              {isAddingTag ? (
                <input
                  ref={tagInputRef}
                  type="text"
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-24"
                  placeholder="New tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagSubmit}
                  onBlur={() => {
                    if (!tagInput.trim()) setIsAddingTag(false);
                  }}
                />
              ) : (
                <button
                  onClick={() => {
                    setIsAddingTag(true);
                    setTimeout(() => tagInputRef.current?.focus(), 0);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              )}
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
            {(() => {
              const subtaskProgress = Array.isArray(task.subtasks) && task.subtasks.length > 0
                ? Math.round((task.subtasks.filter((st: SubTask) => st.completed).length / task.subtasks.length) * 100)
                : 0;
              const completedCount = Array.isArray(task.subtasks) ? task.subtasks.filter((st: SubTask) => st.completed).length : 0;
              const totalCount = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
              return (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Subtasks</h3>
                    <span className="text-gray-400 text-xs font-medium">· {completedCount}/{totalCount}</span>
                  </div>
                  {totalCount > 0 && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${subtaskProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${subtaskProgress}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium min-w-[40px] ${subtaskProgress === 100 ? 'text-green-600' : 'text-gray-500'}`}>
                        {subtaskProgress}%
                      </span>
                    </div>
                  )}
                </>
              );
            })()}
            <div className="space-y-1">
              {Array.isArray(task.subtasks) && task.subtasks.map((subtask: SubTask) => (
                <div key={subtask.id} className="flex items-center justify-between group py-2.5 hover:bg-gray-50 px-3 -mx-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleSubtask(subtask.id, !subtask.completed)}
                      className="focus:outline-none"
                    >
                      <CheckCircle2
                        size={18}
                        className={`cursor-pointer transition-colors ${subtask.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                      />
                    </button>
                    <span className={`text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                      {subtask.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Creator avatar - always visible */}
                    {subtask.createdBy && (
                      <div
                        className="flex items-center gap-1"
                        title={`Created by ${subtask.createdBy.name}`}
                      >
                        {subtask.createdBy.avatar ? (
                          <img
                            src={subtask.createdBy.avatar}
                            alt={subtask.createdBy.name}
                            className="w-5 h-5 rounded-full opacity-60"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] text-gray-500 opacity-60">
                            {subtask.createdBy.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assignees - clickable to assign */}
                    <div className="relative">
                      <button
                        onClick={() => setAssigningSubtaskId(assigningSubtaskId === subtask.id ? null : subtask.id)}
                        className="focus:outline-none flex items-center"
                        title={subtask.assignees?.length ? `Assigned to ${subtask.assignees.map(a => a.name).join(', ')}` : 'Click to assign'}
                      >
                        {subtask.assignees && subtask.assignees.length > 0 ? (
                          <div className="flex -space-x-1.5">
                            {subtask.assignees.slice(0, 3).map((assignee, idx) => (
                              <img
                                key={assignee.id}
                                src={assignee.avatar || `https://avatar.vercel.sh/${assignee.name}`}
                                alt={assignee.name}
                                className="w-6 h-6 rounded-full border-2 border-white"
                                style={{ zIndex: 3 - idx }}
                              />
                            ))}
                            {subtask.assignees.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[9px] text-gray-600 font-medium">
                                +{subtask.assignees.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
                            <UserPlus size={12} />
                          </div>
                        )}
                      </button>

                      {/* Assignee dropdown */}
                      {assigningSubtaskId === subtask.id && (
                        <div className="absolute right-0 top-8 z-50 bg-white rounded-lg shadow-xl border border-gray-100 py-1 min-w-[220px] max-h-[300px] flex flex-col">
                          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 flex justify-between items-center">
                            <span>Assign to</span>
                            <button
                              onClick={() => {
                                setAssigningSubtaskId(null);
                                setSubtaskAssigneeSearch('');
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={12} />
                            </button>
                          </div>

                          {/* Search input */}
                          <div className="px-2 py-2 border-b border-gray-100">
                            <div className="relative">
                              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search members..."
                                value={subtaskAssigneeSearch}
                                onChange={(e) => setSubtaskAssigneeSearch(e.target.value)}
                                className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Members list with checkboxes */}
                          <div className="overflow-y-auto max-h-[180px]">
                            {filteredTeamMembers.length > 0 ? (
                              filteredTeamMembers.map((member) => {
                                const isAssigned = subtask.assignees?.some(a => String(a.id) === String(member.id));
                                return (
                                  <button
                                    key={member.id}
                                    onClick={() => {
                                      handleAssignSubtask(
                                        subtask.id,
                                        String(member.id),
                                        isAssigned ? 'remove' : 'add'
                                      );
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${isAssigned ? 'bg-blue-50' : ''}`}
                                  >
                                    {/* Checkbox indicator */}
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isAssigned ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                      {isAssigned && (
                                        <CheckCircle2 size={12} className="text-white" />
                                      )}
                                    </div>
                                    {member.avatar ? (
                                      <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[9px] text-white font-medium">
                                        {member.name?.charAt(0)}
                                      </div>
                                    )}
                                    <span className={`truncate ${isAssigned ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{member.name}</span>
                                  </button>
                                );
                              })
                            ) : (
                              <div className="px-3 py-4 text-sm text-gray-400 text-center">
                                No members found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delete button - visible on hover */}
                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete subtask"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Date */}
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {new Date(subtask.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
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
                {task.comments.map((comment: AppComment) => (
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
