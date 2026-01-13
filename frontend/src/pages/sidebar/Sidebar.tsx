import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  CheckCircle2,
  FilePlus2,
  ChevronDown,
  UserPlus,
  Settings,
  LayoutDashboard,
} from "lucide-react";

import SidebarItem from "../../components/sidebar/SidebarItem";
import { LetterIcon, SidebarSkeleton } from "../../components/ui";
import { useSidebar } from "./hooks/useSidebar";
import SettingsModal from "../../components/sidebar/SettingsModal";
import NotificationsPopup from "../../components/sidebar/NotificationsPopup";
import CreateProjectModal from "../../components/projectBoard/CreateProjectModal";
import TemplateLibraryModal from "../../components/projectBoard/TemplateLibraryModal";
import CreateTeamModal from "../../components/team/CreateTeamModal";
import SearchPopup from "../../components/sidebar/SearchPopup";
import type { SidebarProps, CreateProjectPayload } from "../../types";
import { sidebarClasses } from "./sidebarStyle";
import { IMAGES } from "../../constants/images";

import {
  useCreateProjectMutation,
  useGetProjectsQuery,
} from "../../store/api/projectApiSlice";
import { useGetTeamsQuery } from "../../store/api/teamApiSlice";
import { useGetNotificationsQuery } from "../../store/api/notificationApiSlice";
import { showToast, getErrorMessage } from "../../components/ui";

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { sections, isSettingsOpen, setIsSettingsOpen, toggleSection } =
    useSidebar();
  const [createProject] = useCreateProjectMutation();
  const { data: projects = [], isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const { data: teams = [], isLoading: isTeamsLoading } = useGetTeamsQuery();
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
  });
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState("Profile");

  const handleOpenTemplateLibrary = () => {
    setIsCreateProjectOpen(false);
    setIsTemplateLibraryOpen(true);
  };

  const handleSelectTemplate = () => {
    setIsTemplateLibraryOpen(false);
    setIsCreateProjectOpen(true);
  };

  const handleCreateProject = async (
    data: CreateProjectPayload,
  ): Promise<void> => {
    try {
      await createProject(data).unwrap();
      showToast.success("Project created successfully!");
      setIsCreateProjectOpen(false);
    } catch (error) {
      showToast.error(`Failed to create project. ${getErrorMessage(error)}`);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className={sidebarClasses.overlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={sidebarClasses.aside(open)}
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {isTeamsLoading || isProjectsLoading ? (
          <SidebarSkeleton />
        ) : (
          <>
            <div className={sidebarClasses.header}>
              <div className={sidebarClasses.logoWrapper}>
                <img
                  src={IMAGES.sidebarLogo}
                  alt="Logo"
                  className={sidebarClasses.logoImage}
                />
                <span className={sidebarClasses.logoText}>Defcon systems</span>
                <ChevronDown size={14} className={sidebarClasses.chevronIcon} />
              </div>

              <button
                className={sidebarClasses.collapseButton}
                onClick={onClose}
              >
                <img
                  src={IMAGES.collapse}
                  alt="Collapse"
                  className={sidebarClasses.collapseImage}
                />
              </button>
            </div>

            <div className={sidebarClasses.scrollableContent}>
              <div className={sidebarClasses.mainSection}>
                <SidebarItem
                  icon={Search}
                  label="Search"
                  isActive={isSearchOpen}
                  onClick={() => setIsSearchOpen(true)}
                />
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  to="/dashboard"
                />
                <SidebarItem
                  icon={Bell}
                  label="Notifications"
                  isActive={isNotificationsOpen}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  badge={
                    unreadNotificationCount > 0 ? (
                      <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {unreadNotificationCount > 9
                          ? "9+"
                          : unreadNotificationCount}
                      </span>
                    ) : undefined
                  }
                />
                <SidebarItem icon={CheckCircle2} label="Tasks" to="/tasks" />
                <SidebarItem
                  icon={FilePlus2}
                  label="Create Project"
                  onClick={() => setIsCreateProjectOpen(true)}
                  disabled={!teams || teams.length === 0}
                />
              </div>

              <div>
                <div className={sidebarClasses.teamspacesTitle}>Teamspaces</div>

                <SidebarItem
                  label="Teams"
                  badge={<LetterIcon letter="T" />}
                  hasSubmenu
                  isOpen={sections.mobileApp}
                  onClick={() => toggleSection("mobileApp")}
                />

                {sections.mobileApp && (
                  <>
                    {teams.length > 0 ? (
                      teams.map((team) => (
                        <SidebarItem
                          key={team.id}
                          label={team.name}
                          indent={3}
                          to={`/team?teamId=${team.id}`}
                        />
                      ))
                    ) : (
                      <div className="pl-6 py-2 text-xs text-gray-400 italic">
                        No teams yet
                      </div>
                    )}
                  </>
                )}

                <div className={sidebarClasses.spacer} />

                <SidebarItem
                  label="Projects"
                  badge={<LetterIcon letter="P" />}
                  hasSubmenu
                  isOpen={sections.diadora}
                  onClick={() => toggleSection("diadora")}
                />

                {sections.diadora && (
                  <>
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <SidebarItem
                          key={project.id}
                          label={project.name}
                          indent={3}
                          to={`/projectboard?projectId=${project.id}`}
                        />
                      ))
                    ) : (
                      <div className="pl-6 py-2 text-xs text-gray-400 italic">
                        No projects yet
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className={sidebarClasses.footer}>
              <SidebarItem
                icon={UserPlus}
                label="Invite teammates"
                disabled={!teams || teams.length === 0}
                onClick={() => {
                  setSettingsInitialTab("Members");
                  setIsSettingsOpen(true);
                }}
              />
              <SidebarItem
                icon={Settings}
                label="Setting"
                onClick={() => {
                  setSettingsInitialTab("Profile");
                  setIsSettingsOpen(true);
                }}
              />
            </div>
          </>
        )}
      </motion.aside>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsInitialTab}
      />
      <NotificationsPopup
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreate={handleCreateProject}
        onOpenTemplateLibrary={handleOpenTemplateLibrary}
        onOpenTeamModal={() => {
          setIsCreateProjectOpen(false);
          setIsTeamModalOpen(true);
        }}
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
