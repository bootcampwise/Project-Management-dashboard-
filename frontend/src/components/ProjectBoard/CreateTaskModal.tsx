import React from 'react';
import { X, Upload, File } from 'lucide-react';

import type { CreateTaskPayload, CreateTaskModalProps } from '../../types';

import { useCreateTaskModal } from '../../hooks/useCreateTaskModal';


const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate, initialStatus }) => {
    const {
        title, setTitle,
        status, setStatus,
        priority, setPriority,
        tags, setTags,
        tagInput, setTagInput,
        handleAddTag, handleRemoveTag,
        description, setDescription,
        attachments,
        selectedProjectId, setSelectedProjectId,
        projects, isLoading,
        fileInputRef,
        handleFileChange,
        handleCreate,
        removeAttachment,
        dueDate,
        setDueDate,
        assigneeIds,
        assigneeSearch,
        setAssigneeSearch,
        filteredMembers,
        handleToggleAssignee,
        uniqueMembers
    } = useCreateTaskModal({ isOpen, onClose, onCreate, initialStatus });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Create New Task</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-5">

                    {/* Project Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Select Project
                        </label>
                        <div className="relative">
                            <select
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                disabled={isLoading || projects.length === 0}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer text-gray-700 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <option>Loading projects...</option>
                                ) : projects.length === 0 ? (
                                    <option>No projects found</option>
                                ) : (
                                    projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Redesign Homepage"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all placeholder-gray-400"
                        />
                    </div>

                    {/* Status, Priority, Due Date & Assignee Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer text-gray-700"
                                >
                                    <option value="In Progress">In Progress</option>
                                    <option value="Backlog">Backlog</option>
                                    <option value="QA">QA</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="To Do">To Do</option>
                                    <option value="Postponed">Postponed</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Priority
                            </label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer text-gray-700"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700"
                            />
                        </div>

                        {/* Assignees */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Assignees
                            </label>

                            {/* Selected Assignees List */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {assigneeIds.length > 0 && assigneeIds.map(id => {
                                    const member = uniqueMembers.find(m => m.id === id);
                                    if (!member) return null;
                                    return (
                                        <div key={id} className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px] overflow-hidden">
                                                {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : (member.name?.[0] || 'U')}
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{member.name}</span>
                                            <button
                                                onClick={() => handleToggleAssignee(id)}
                                                className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Search Input and Dropdown */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={assigneeSearch}
                                    onChange={(e) => setAssigneeSearch(e.target.value)}
                                    placeholder={assigneeIds.length > 0 ? "Add more..." : "Search member..."}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all placeholder-gray-400"
                                />
                                {/* Dropdown Results */}
                                {assigneeSearch && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                        {filteredMembers.length > 0 ? (
                                            filteredMembers.map(member => {
                                                const isSelected = assigneeIds.includes(member.id);
                                                return (
                                                    <div
                                                        key={member.id}
                                                        onClick={() => {
                                                            handleToggleAssignee(member.id);
                                                            setAssigneeSearch("");
                                                        }}
                                                        className={`px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs overflow-hidden">
                                                                {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : (member.name?.[0] || 'U')}
                                                            </div>
                                                            <span className="text-sm text-gray-700">{member.name}</span>
                                                        </div>
                                                        {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">No members found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Tags
                        </label>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type and press Enter to add tags..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all placeholder-gray-400"
                            />
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <div key={index} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">
                                            <span>{tag}</span>
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Add detailed description..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all resize-none placeholder-gray-400"
                        />
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Attachments
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                                <Upload size={20} />
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Click to upload</p>
                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* File List */}
                        {attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-500 border border-gray-200 shadow-sm">
                                            <File size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(idx)}
                                            className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white border boundary-transparent hover:border-gray-200 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!title.trim() || isLoading}
                        className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all flex items-center gap-2 ${!title.trim() || isLoading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-md"
                            }`}
                    >
                        {isLoading ? "Creating..." : "Create Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
