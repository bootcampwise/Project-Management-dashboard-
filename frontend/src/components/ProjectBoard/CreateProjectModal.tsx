import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { IconButton, Input, Select, Textarea } from '../ui';
import type { CreateProjectModalProps } from '../../types';
import { useCreateProjectModal } from "../../pages/projectboard/hooks/useCreateProjectModal";

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onOpenTemplateLibrary, onCreate }) => {
  const {
    teams,
    projectName,
    setProjectName,
    description,
    setDescription,
    dueDate,
    setDueDate,
    selectedTeamId,
    setSelectedTeamId,
    privacy,
    setPrivacy,
    isCreating,
    handleCreate
  } = useCreateProjectModal({ isOpen, onClose, onCreate });


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-full m-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Create new project</h2>
          <IconButton icon={<X size={20} />} onClick={onClose} className="text-gray-400 hover:text-gray-600" />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* Project Name */}
          <div className="mb-5">
            <Input
              type="text"
              label="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          {/* Template */}
          <div className="mb-5">
            <div className="flex items-center gap-1 mb-1.5">
              <label className="block text-xs font-medium text-gray-400 uppercase">
                Template
              </label>
            </div>
            <button
              onClick={onOpenTemplateLibrary}
              className="w-full flex items-center justify-between px-3 py-2.5 border border-dashed border-teal-300 bg-teal-50 rounded-md text-teal-700 hover:bg-teal-100 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-teal-600" />
                <span className="text-sm font-medium">Select templates form library</span>
              </div>
              <span className="text-teal-400 group-hover:text-teal-600 text-lg">›</span>
            </button>
          </div>

          {/* Team and Privacy Row */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Select a team */}
            <Select
              label="Select a team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              options={[
                { value: '', label: 'Select a team', disabled: true },
                ...teams.map(team => ({ value: team.id, label: team.name }))
              ]}
            />

            {/* Privacy */}
            <Select
              label="Privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as "public" | "private" | "team")}
              options={[
                { value: 'public', label: 'Public to team' },
                { value: 'private', label: 'Private to members' },
                { value: 'team', label: 'Shared with team' }
              ]}
            />
          </div>

          {/* Due Date */}
          <div className="mb-5">
            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-2">
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Please share your main reason..."
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-dashed border-blue-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              disabled={isCreating || !projectName.trim()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-md shadow-sm shadow-blue-200 transition-colors"
            >
              {isCreating ? "Creating..." : "Create project"}
            </button>
            <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-gray-100 rounded-b-lg border-t border-dashed border-blue-200">
          <p className="text-xs text-gray-500">
            Learn more about projects by watching <a href="#" className="text-blue-500 hover:underline">tutorial video.</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
