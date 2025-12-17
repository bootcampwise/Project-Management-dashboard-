import React, { useState } from "react";
import Sidebar from "../components/Sidebar/index";
import {
    Menu,
    Star,
    MoreHorizontal,
    Share2,
    ChevronDown,
    Search,
    Filter,
    ArrowUpDown,
} from "lucide-react";
import TeamTableView from "../components/Team/TeamTableView";
import TeamDashboard from "../components/Team/TeamDashboard";
import TeamMembers from "../components/Team/TeamMembers";
import TeamFiles from "../components/Team/TeamFiles";
import CreateTeamModal from "../components/ProjectBoard/CreateTeamModal";
import SearchPopup from "../components/SearchPopup";

const Team: React.FC = () => {
    // Initialize based on screen width
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [activeTab, setActiveTab] = useState("Projects");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const tabs = ["Projects", "Dashboard", "Members", "Files"];

    return (
        <div className="flex h-screen bg-white relative font-sans">
            {/* Mobile menu button (and Desktop re-open button) */}
            <button
                className={`absolute top-4 left-4 z-30 p-2 bg-white rounded-md shadow ${sidebarOpen ? 'md:hidden' : 'block'}`}
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={22} />
            </button>

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-white flex flex-col">
                <div className={`transition-all duration-300 flex-1 flex flex-col ${!sidebarOpen ? 'pt-16 md:pt-0 md:pl-16' : ''}`}>

                    {/* Header Top Row */}
                    <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Title & Status */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-800">Defcon /Directions</h1>
                                <Star className="text-yellow-400 fill-current" size={18} />
                                <MoreHorizontal className="text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 bg-white">
                                <Share2 size={16} />
                                <span>Share</span>
                            </button>
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-700"
                                onClick={() => setIsCreateTeamModalOpen(true)}
                            >
                                <span>Create</span>
                                <ChevronDown size={14} className="border-l border-blue-500 pl-1 ml-1 h-4 w-auto" />
                            </button>
                        </div>
                    </div>

                    {/* Header Bottom Row (Toolbar) */}
                    <div className="px-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                        ? 'border-gray-800 text-gray-800'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tools */}
                        <div className="flex items-center gap-4 py-2">
                            <div
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search size={16} />
                                <span className="text-sm">Search</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300 mx-1"></div>
                            <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                                <Filter size={16} />
                                <span className="text-sm">Filter</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                                <ArrowUpDown size={16} />
                                <span className="text-sm">Sort</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto">
                        {activeTab === "Projects" && <TeamTableView />}
                        {activeTab === "Dashboard" && <TeamDashboard />}
                        {activeTab === "Members" && <TeamMembers />}
                        {activeTab === "Files" && <TeamFiles />}
                    </div>

                </div>
            </main>
            <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} />
        </div>
    );
};

export default Team;
