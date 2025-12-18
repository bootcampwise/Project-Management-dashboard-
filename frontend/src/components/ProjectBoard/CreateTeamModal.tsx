import React from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { useCreateTeamModal } from '../../hooks/useCreateTeamModal';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose }) => {
    const {
        teamName,
        setTeamName,
        membersInput,
        setMembersInput,
        selectedMembers,
        setShowSuggestions,
        isMembersLoading,
        filteredMembers,
        toggleMemberSelection,
        // Projects
        projects,
        isProjectsLoading,
        selectedProjectIds,
        isProjectDropdownOpen,
        setIsProjectDropdownOpen,
        handleProjectToggle,
        // Creation
        isCreating,
        handleCreateTeam
    } = useCreateTeamModal(isOpen, onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-full m-4 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Create new team</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Team Name */}
                    <div className="mb-5">
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">
                            Team name
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm"
                            placeholder="|"
                        />
                    </div>

                    {/* Projects */}
                    <div className="mb-5 relative">
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">
                            Projects
                        </label>
                        <button
                            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                            className="w-full flex items-center justify-between px-3 py-2.5 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 transition-colors"
                        >
                            <span className="text-sm">
                                {selectedProjectIds.length > 0
                                    ? `${selectedProjectIds.length} projects selected`
                                    : "Select projects"}
                            </span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Projects Dropdown */}
                        {isProjectDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                                {isProjectsLoading ? (
                                    <div className="p-3 text-center text-sm text-gray-400">Loading projects...</div>
                                ) : projects.length > 0 ? (
                                    projects.map(project => (
                                        <div
                                            key={project.id}
                                            onClick={() => handleProjectToggle(project.id)}
                                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                        >
                                            <span className="text-gray-700">{project.name}</span>
                                            {selectedProjectIds.includes(project.id) && (
                                                <Check size={14} className="text-blue-500" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-sm text-gray-400">No projects found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Members Input */}
                    <div className="mb-6 relative">
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">
                            Members
                        </label>
                        <input
                            type="text"
                            value={membersInput}
                            onChange={(e) => {
                                setMembersInput(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-400"
                            placeholder="Search members by name or email"
                        />
                    </div>

                    {/* Members List - showing actual members from Redux */}
                    <div className="space-y-4 max-h-[200px] overflow-y-auto">
                        <h4 className="text-xs font-medium text-gray-500 uppercase">Available Members</h4>
                        {isMembersLoading ? (
                            <div className="text-center py-4 text-gray-400 text-sm">Loading members...</div>
                        ) : filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => {
                                const isSelected = selectedMembers.some(m => m.id === member.id);
                                return (
                                    <div
                                        key={member.id}
                                        className={`flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded ${isSelected ? 'bg-blue-50' : ''}`}
                                        onClick={() => toggleMemberSelection(member)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-800">{member.name}</h4>
                                                <p className="text-xs text-gray-500">{member.position}</p>
                                            </div>
                                        </div>
                                        <button className={`flex items-center gap-1 text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {isSelected && <Check size={14} />}
                                            <span>{isSelected ? 'Selected' : 'Select'}</span>
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-4 text-gray-400 text-sm">No members found</div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-dashed border-blue-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCreateTeam}
                            disabled={isCreating || !teamName.trim()}
                            className={`px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-sm shadow-blue-200 transition-colors ${isCreating || !teamName.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                        >
                            {isCreating ? 'Creating...' : 'Create Team'}
                        </button>
                        <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-3 bg-[#F3F4F6] rounded-b-lg border-t border-dashed border-blue-200">
                    <p className="text-xs text-gray-500">
                        Learn more about projects by watching <a href="#" className="text-blue-500 hover:underline">tutorial video.</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamModal;
