import React, { useState } from "react";
import {
    Search,
    Bell,
    CheckCircle2,
    FilePlus2,
    ChevronDown,
    UserPlus,
    Settings
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import ProjectIcon from "./ProjectIcon";
import { useSidebar } from "../../hooks/sidebar/useSidebar";
import SettingsModal from "../SettingsModal";
import NotificationsPopup from "./NotificationsPopup";
import CreateProjectModal from "../ProjectBoard/CreateProjectModal";
import TemplateLibraryModal from "../ProjectBoard/TemplateLibraryModal";
import CreateTeamModal from "../Team/CreateTeamModal";
import SearchPopup from "../SearchPopup";
import type { SidebarProps, CreateProjectPayload } from "../../types";

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {

    const { sections, isSettingsOpen, setIsSettingsOpen, toggleSection } = useSidebar();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [settingsInitialTab, setSettingsInitialTab] = useState('Profile');

    const handleOpenTemplateLibrary = () => {
        setIsCreateProjectOpen(false);
        setIsTemplateLibraryOpen(true);
    };

    const handleSelectTemplate = () => {
        setIsTemplateLibraryOpen(false);
        setIsCreateProjectOpen(true);
    };

    const handleCreateProject = async (_data: CreateProjectPayload): Promise<void> => {
        setIsCreateProjectOpen(false);
        setIsTeamModalOpen(true);
    };


    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Panel */}
            <aside
                className={`
                fixed md:static z-50
                top-0 left-0 h-full
                bg-[#F7F8FA] border-r border-gray-200 flex flex-col
                transform transition-all duration-300 ease-in-out
                ${open ? "translate-x-0 w-[280px]" : "-translate-x-full w-0 md:translate-x-0 md:w-0 overflow-hidden"}
            `}
            >

                {/* Header */}
                <div className="h-14 px-4 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/50 p-1 rounded-md max-w-full">
                        <img
                            src="/sidebarlogo.png"
                            alt="Logo"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="font-semibold text-gray-800 text-sm truncate">
                            Defcon systems
                        </span>
                        <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />
                    </div>

                    {/* Collapse Button */}
                    <button
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200/50"
                        onClick={onClose}
                    >
                        <img src="/collapse.png" alt="Collapse" className="w-8 h-8 object-contain opacity-60 hover:opacity-100" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-2 space-y-6">

                    {/* Main */}
                    <div className="space-y-0.5">
                        <SidebarItem
                            icon={Search}
                            label="Search"
                            isActive={isSearchOpen}
                            onClick={() => setIsSearchOpen(true)}
                        />
                        <SidebarItem
                            icon={Bell}
                            label="Notifications"
                            isActive={isNotificationsOpen}
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        />
                        <SidebarItem icon={CheckCircle2} label="Tasks" to="/tasks" />
                        <SidebarItem
                            icon={FilePlus2}
                            label="Create Project"
                            onClick={() => setIsCreateProjectOpen(true)}
                        />
                    </div>

                    {/* Teamspaces */}
                    <div>
                        <div className="px-4 text-xs font-semibold text-gray-400 mb-2">
                            Teamspaces
                        </div>

                        {/* MOBILE APP */}
                        <SidebarItem
                            label="Mobile app: design"
                            badge={<ProjectIcon letter="M" />}
                            hasSubmenu
                            isOpen={sections.mobileApp}
                            onClick={() => toggleSection("mobileApp")}
                        />

                        {sections.mobileApp && (
                            <>
                                <SidebarItem label="Intro" indent={3} />
                                <SidebarItem label="Team" indent={2} hasSubmenu to="/team" />
                                <SidebarItem label="Process" indent={3} />
                                <SidebarItem label="HR" indent={3} />
                            </>
                        )}

                        <div className="h-2" />

                        {/* DIADORA */}
                        <SidebarItem
                            label="Diadora scoup"
                            badge={<ProjectIcon letter="D" />}
                            hasSubmenu
                            isOpen={sections.diadora}
                            onClick={() => toggleSection("diadora")}
                        />

                        {sections.diadora && (
                            <>
                                <SidebarItem label="Ideas and details" indent={3} />
                                <SidebarItem label="Project Board [2023]" indent={3} isActive to="/projectboard" />
                                <SidebarItem label="Design References" indent={3} />
                                <SidebarItem label="QA and review" indent={3} />
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-gray-200">
                    <SidebarItem
                        icon={UserPlus}
                        label="Invite teammates"
                        onClick={() => {
                            setSettingsInitialTab('Members');
                            setIsSettingsOpen(true);
                        }}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Setting"
                        onClick={() => {
                            setSettingsInitialTab('Profile');
                            setIsSettingsOpen(true);
                        }}
                    />
                </div>
            </aside>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} initialTab={settingsInitialTab} />
            <NotificationsPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
            <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <CreateProjectModal
                isOpen={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)}
                onCreate={handleCreateProject}
                onOpenTemplateLibrary={handleOpenTemplateLibrary}
            />
            <TemplateLibraryModal
                isOpen={isTemplateLibraryOpen}
                onClose={() => {
                    setIsTemplateLibraryOpen(false);
                    setIsCreateProjectOpen(true);
                }}
                onSelectTemplate={handleSelectTemplate}
            />
            <CreateTeamModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
            />
        </>
    );
};

export default Sidebar;
