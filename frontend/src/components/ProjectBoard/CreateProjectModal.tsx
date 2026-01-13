import React from "react";
import { X, Sparkles, Plus } from "lucide-react";
import { IconButton, Input, Select, Textarea } from "../ui";
import type { CreateProjectModalProps } from "../../types";
import { useCreateProjectModal } from "../../pages/projectboard/hooks/useCreateProjectModal";

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onOpenTemplateLibrary,
  onOpenTeamModal,
  onCreate,
}) => {
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
    handleCreate,
  } = useCreateProjectModal({ isOpen, onClose, onCreate });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-w-full m-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Create new project
          </h2>
          <IconButton
            icon={<X size={20} />}
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          />
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-5">
            <Input
              type="text"
              label="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-1 mb-1.5">
              <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                Template
              </label>
            </div>
            <button
              onClick={onOpenTemplateLibrary}
              className="w-full flex items-center justify-between px-3 py-2.5 border border-dashed border-teal-300 dark:border-teal-600 bg-teal-50 dark:bg-teal-900/30 rounded-md text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-teal-600 dark:text-teal-400"
                />
                <span className="text-sm font-medium">
                  Select templates form library
                </span>
              </div>
              <span className="text-teal-400 dark:text-teal-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 text-lg">
                ›
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Select a team
              </label>
              {teams.length === 0 ? (
                <button
                  type="button"
                  onClick={onOpenTeamModal}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Plus size={16} />
                  <span className="text-sm font-medium">
                    Create a Team First
                  </span>
                </button>
              ) : (
                <Select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  options={[
                    { value: "", label: "Select a team", disabled: true },
                    ...teams.map((team) => ({
                      value: team.id,
                      label: team.name,
                    })),
                  ]}
                />
              )}
            </div>

            <Select
              label="Privacy"
              value={privacy}
              onChange={(e) =>
                setPrivacy(e.target.value as "public" | "private" | "team")
              }
              options={[
                { value: "public", label: "Public to team" },
                { value: "private", label: "Private to members" },
                { value: "team", label: "Shared with team" },
              ]}
            />
          </div>

          <div className="mb-5">
            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

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

        <div className="px-6 py-4 border-t border-dashed border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              disabled={isCreating || !projectName.trim()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm shadow-blue-200 dark:shadow-blue-900 transition-colors"
            >
              {isCreating ? "Creating..." : "Create project"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-100 dark:bg-gray-900 rounded-b-lg border-t border-dashed border-blue-200 dark:border-blue-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Learn more about projects by watching{" "}
            <a
              href="#"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              tutorial video.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
