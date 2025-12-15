import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useDispatch } from 'react-redux';
import { signOut } from '../store/slices/authSlice';
import type { AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: string;
}


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialTab = 'Profile' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(signOut());
        onClose();
        navigate('/signup');
    };

    React.useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);
    const [notifications, setNotifications] = useState({
        activityUpdates: true,
        mentions: true,
        dailyDigest: false,
        tipsAndTricks: false
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl h-[600px] flex overflow-hidden z-10 text-left">

                {/* Left Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0 p-6">
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Settings</h3>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('Profile')}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'Profile' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('General')}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'General' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('Notifications')}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'Notifications' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Notifications
                            </button>
                        </nav>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Workspace</h3>
                        <nav className="space-y-1">
                            <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                                Settings
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                                Teamspaces
                            </button>
                            <button
                                onClick={() => setActiveTab('Members')}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'Members' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Members
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                                Integrations
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content (Right Side) */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">{activeTab}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        {activeTab === 'Profile' ? (
                            <div className="max-w-2xl space-y-6">
                                {/* Photo Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <User size={32} className="text-gray-300" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                                    Upload new photo
                                                </button>
                                                <span className="text-gray-300">•</span>
                                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                                    Remove photo
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400">Pick a photo up to 4MB.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Full name</label>
                                    <input
                                        type="text"
                                        defaultValue="Yauhen Rymaszewski"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                {/* Job Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Job title</label>
                                    <input
                                        type="text"
                                        defaultValue="Product designer"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>

                                {/* Team */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Team</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none bg-white"
                                            defaultValue="Designer Team"
                                        >
                                            <option>Designer Team</option>
                                            <option>Development Team</option>
                                            <option>Marketing Team</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-500">Email</label>
                                        <button className="text-xs text-gray-500 hover:text-gray-700">Change email</button>
                                    </div>
                                    <input
                                        type="email"
                                        defaultValue="yauhen1312@gmail.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                            </div>
                        ) : activeTab === 'General' ? (
                            <div className="max-w-2xl space-y-6">
                                {/* General Tab Content */}

                                {/* Theme */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Theme</label>
                                    <div className="relative">
                                        <select
                                            value={theme}
                                            onChange={(e) => toggleTheme(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none bg-white"
                                        >
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Language</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none bg-white"
                                            defaultValue="English"
                                        >
                                            <option>English</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Zone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Time zone</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none bg-white"
                                            defaultValue="Islamad"
                                        >
                                            <option>Islamad</option>
                                            <option>London</option>
                                            <option>New York</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Format */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Time format</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none bg-white"
                                            defaultValue="13:00"
                                        >
                                            <option>13:00</option>
                                            <option>1:00 PM</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Format */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Date Format</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none bg-white"
                                            defaultValue="DD-MM-YYYY"
                                        >
                                            <option>DD-MM-YYYY</option>
                                            <option>MM/DD/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'Notifications' ? (
                            <div className="max-w-2xl space-y-6">
                                {/* Notifications Tab Content */}
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Activity updates</h3>
                                            <p className="text-sm text-gray-500 mt-1">New tasks assigned to you, @mentions, and completion notifications for tasks you're a collaborator on</p>
                                        </div>
                                        <button
                                            onClick={() => toggleNotification('activityUpdates')}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications.activityUpdates ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`${notifications.activityUpdates ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Mentions</h3>
                                            <p className="text-sm text-gray-500 mt-1">New tasks assigned to you, direct messages, and @mentions</p>
                                        </div>
                                        <button
                                            onClick={() => toggleNotification('mentions')}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications.mentions ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`${notifications.mentions ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <h3 className="text-sm font-medium text-gray-900 mb-4">Emails</h3>

                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Daily digest</h3>
                                            <p className="text-sm text-gray-500 mt-1">Personalized productivity stats plus your tasks due today.</p>
                                        </div>
                                        <button
                                            onClick={() => toggleNotification('dailyDigest')}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications.dailyDigest ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`${notifications.dailyDigest ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                                        </button>
                                    </div>

                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Tips and tricks</h3>
                                            <p className="text-sm text-gray-500 mt-1">Powerful productivity advice in your inbox, Sent once a month.</p>
                                        </div>
                                        <button
                                            onClick={() => toggleNotification('tipsAndTricks')}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications.tipsAndTricks ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`${notifications.tipsAndTricks ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'Members' ? (
                            <div className="max-w-2xl space-y-6">
                                {/* Members Tab Content */}

                                {/* Invite Members Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Invite members</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="email"
                                            placeholder=""
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        />
                                        <button className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm">
                                            Invite
                                        </button>
                                    </div>
                                </div>

                                {/* Members List */}
                                <div className="space-y-3 mt-6">
                                    {[1, 2, 3, 4, 5].map((_, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                                                    <User size={20} className="text-amber-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Mehrab Murtaza</h4>
                                                    <p className="text-xs text-gray-500">Lead Designer</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <select className="px-3 py-1.5 pr-8 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                                                        <option>3 Timespaces</option>
                                                        <option>2 Timespaces</option>
                                                        <option>1 Timespace</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <select className="px-3 py-1.5 pr-8 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                                                        <option>Owner</option>
                                                        <option>Admin</option>
                                                        <option>Member</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm">
                                Save
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 shadow-sm" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                        {activeTab === 'Profile' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 border border-red-200"
                                >
                                    Log out
                                </button>
                                <button className="px-4 py-2 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 border border-red-200">
                                    Delete account
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
