import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose }) => {
    const [teamName, setTeamName] = useState('');
    const [membersInput, setMembersInput] = useState('');

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
                    <div className="mb-5">
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">
                            Projects
                        </label>
                        <button className="w-full flex items-center justify-between px-3 py-2.5 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 transition-colors">
                            <span className="text-sm"></span>
                            <span className="text-gray-400 text-lg">›</span>
                        </button>
                    </div>

                    {/* Members Input */}
                    <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">
                            Members
                        </label>
                        <input
                            type="text"
                            value={membersInput}
                            onChange={(e) => setMembersInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-300 focus:outline-none focus:border-gray-300"
                            placeholder="Add members by name or email"
                        />
                    </div>

                    {/* Members List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <img src="https://i.pravatar.cc/150?u=12" alt="Mehrab" className="w-10 h-10 rounded-full" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800">Mehrab Murtaza</h4>
                                    <p className="text-xs text-gray-500">Lead Designer</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                                <span>Owner</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <img src="https://i.pravatar.cc/150?u=24" alt="Ahmad" className="w-10 h-10 rounded-full" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800">Ahmad</h4>
                                    <p className="text-xs text-gray-500">UI Designer</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                                <span>Editor</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-dashed border-blue-200">
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm shadow-blue-200 transition-colors">
                            Create Team
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
