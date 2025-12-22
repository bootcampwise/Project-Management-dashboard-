import React from "react";
import { useTeam } from "../hooks/useTeam";
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
    Check,
    Plus,
    ChevronRight,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import TeamTableView from "../components/Team/TeamTableView";
import TeamDashboard from "../components/Team/TeamDashboard";
import TeamMembers from "../components/Team/TeamMembers";
import TeamFiles from "../components/Team/TeamFiles";
import CreateTeamModal from "../components/ProjectBoard/CreateTeamModal";
import SearchPopup from "../components/SearchPopup";

const Team: React.FC = () => {
    const {
        sidebarOpen,
        setSidebarOpen,
        activeTab,
        setActiveTab,
        isSearchOpen,
        setIsSearchOpen,
        isCreateTeamModalOpen,
        setIsCreateTeamModalOpen,
        tabs,
        // Data and Handlers from Hook
        projects,
        activeProject,
        isProjectDropdownOpen,
        setIsProjectDropdownOpen,
        isMenuDropdownOpen,
        setIsMenuDropdownOpen,
        menuRef,
        handleSwitchProject,
        handleDeleteProject,
    } = useTeam();

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
                            <div className="flex items-center gap-2 relative" ref={menuRef}>
                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors"
                                    onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                                >
                                    <h1 className="text-xl font-bold text-gray-800">{activeProject?.name || "No Projects"}</h1>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Project Switcher Dropdown */}
                                {isProjectDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Switch Project
                                        </div>
                                        {projects.map(p => (
                                            <button
                                                key={p.id}
                                                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${activeProject?.id === p.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                                onClick={() => handleSwitchProject(p)}
                                            >
                                                <span className="truncate">{p.name}</span>
                                                {activeProject?.id === p.id && <Check size={14} />}
                                            </button>
                                        ))}
                                        {projects.length === 0 && (
                                            <div className="px-3 py-2 text-sm text-gray-500 italic">No projects found</div>
                                        )}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                                                onClick={() => {
                                                    setIsProjectDropdownOpen(false);
                                                    setIsCreateTeamModalOpen(true); // Is this right? Create Project or Create Team?
                                                }}
                                            >
                                                <Plus size={14} />
                                                Create New Project
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <Star className="text-yellow-400 fill-current ml-2" size={18} />

                                <div className="relative">
                                    <button
                                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                                    >
                                        <MoreHorizontal className="text-gray-400" size={18} />
                                    </button>

                                    {/* Menu Dropdown */}
                                    {isMenuDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-xs text-gray-500">Active Project</p>
                                                <p className="text-sm font-medium text-gray-800 truncate">{activeProject?.name || "None"}</p>
                                            </div>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                onClick={() => {
                                                    setIsMenuDropdownOpen(false);
                                                    setIsProjectDropdownOpen(true);
                                                }}
                                            >
                                                <ChevronRight size={14} />
                                                Switch Project
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                onClick={() => {
                                                    // Move Toast logic here or keep it inline? 
                                                    // Since Toast requires UI (confirmation), keeping it inline or moving the confirmation logic to hook?
                                                    // For now, I'll keep the toast UI here but call handleDeleteProject inside confirm.
                                                    setIsMenuDropdownOpen(false);
                                                    toast((t) => (
                                                        <div className="flex flex-col gap-3 min-w-[250px]">
                                                            <div>
                                                                <h3 className="font-medium text-gray-900">Delete Project?</h3>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Are you sure you want to delete <span className="font-semibold">{activeProject?.name}</span>? This action cannot be undone.
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
                                                                    onClick={() => {
                                                                        toast.dismiss(t.id);
                                                                        if (activeProject) {
                                                                            handleDeleteProject(activeProject.id);
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
                                                        position: "top-center",
                                                        style: {
                                                            minWidth: '300px',
                                                        }
                                                    });
                                                }}
                                            >
                                                <Trash2 size={14} />
                                                Delete Project
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 bg-white">
                                <Share2 size={16} />
                                <span className="text-sm">Share</span>
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
                            {
                                tabs.map((tab) => (
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
                                ))
                            }
                        </div >

                        {/* Tools */}
                        < div className="flex items-center gap-4 py-2" >
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
                        </div >
                    </div >

                    {/* Content Area */}
                    < div className="flex-1 overflow-auto" >
                        {activeTab === "Teams" && <TeamTableView projectId={activeProject?.id} />}
                        {activeTab === "Dashboard" && <TeamDashboard />}
                        {activeTab === "Members" && <TeamMembers />}
                        {activeTab === "Files" && <TeamFiles />}
                    </div >

                </div >
            </main >
            <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} />
        </div >
    );
};

export default Team;
