import React from 'react';
import { X, FileText } from 'lucide-react';

interface NotificationProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationsPopup: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed left-[280px] top-4 w-[400px] bg-white rounded-lg shadow-xl border border-gray-200 z-[100] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="font-semibold text-lg text-gray-800">Notifications</h3>
                <button className="text-sm text-gray-400 hover:text-gray-600">
                    Mark all as read
                </button>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {/* Item 1 */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                        <img src="https://i.pravatar.cc/150?u=1" alt="Olivia" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">Olivia Haze</span> joined the project <span className="font-medium">Marketing</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">1 min ago</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">Defcon systems</span>
                            </div>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                        <img src="https://i.pravatar.cc/150?u=2" alt="Hanna" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">Hanna Wayne</span> wants to edit project <span className="font-medium">Directions</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1 mb-3">
                                <span className="text-xs text-gray-400">5 min ago</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">Defcon systems</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors">
                                    Approve
                                </button>
                                <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                                    Deny
                                </button>
                            </div>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                </div>

                {/* Item 3 */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                        <img src="https://i.pravatar.cc/150?u=3" alt="Greg" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">Greg Rodrigues</span> commented in <span className="font-medium">Directions</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1 mb-3">
                                <span className="text-xs text-gray-400">30 min ago</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">Defcon systems</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
                                A tutorial would be cool. Unsure if people can see each others schedules without being admin?
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item 4 */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                        <img src="https://i.pravatar.cc/150?u=1" alt="Olivia" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">Olivia Haze</span> shared a file in <span className="font-medium">Marketing</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1 mb-3">
                                <span className="text-xs text-gray-400">1 hour ago</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">Defcon systems</span>
                            </div>
                            <div className="border border-gray-200 p-3 rounded flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center text-white">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Landing_draft.pdf</p>
                                    <p className="text-xs text-gray-500">PDF • Download</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item 5 */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                        <img src="https://i.pravatar.cc/150?u=4" alt="Valery" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">Valery Shane</span> marked 10 tasks complete in <span className="font-medium">BilldCorp</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">1 day ago</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">Defcon systems</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item 6 */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                        <img src="https://i.pravatar.cc/150?u=1" alt="Olivia" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">Olivia Haze</span> wants to edit project <span className="font-medium">Directions</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1 mb-3">
                                <span className="text-xs text-gray-400">2 days ago</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">Defcon systems</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors">
                                    Approve
                                </button>
                                <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                                    Deny
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotificationsPopup;
