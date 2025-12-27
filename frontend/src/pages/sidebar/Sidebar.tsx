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

import SidebarItem from "../../components/sidebar/SidebarItem";
import { LetterIcon, SidebarSkeleton } from "../../components/ui"
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

import { useCreateProjectMutation, useGetProjectsQuery } from "../../store/api/projectApiSlice";
import { useGetTeamsQuery } from "../../store/api/teamApiSlice";
import { showToast, getErrorMessage } from "../../components/ui";

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {

  const { sections, isSettingsOpen, setIsSettingsOpen, toggleSection } = useSidebar();
  const [createProject] = useCreateProjectMutation();
  const { data: projects = [], isLoading: isProjectsLoading } = useGetProjectsQuery();
  const { data: teams = [], isLoading: isTeamsLoading } = useGetTeamsQuery();
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

  const handleCreateProject = async (data: CreateProjectPayload): Promise<void> => {
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
      {/* Overlay */}
      {open && (
        <div
          className={sidebarClasses.overlay}
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={sidebarClasses.aside(open)}>
        {/* Show full skeleton while loading */}
        {(isTeamsLoading || isProjectsLoading) ? (
          <SidebarSkeleton />
        ) : (
          <>
            {/* Header */}
            <div className={sidebarClasses.header}>
              <div className={sidebarClasses.logoWrapper}>
                <img
                  src={IMAGES.sidebarLogo}
                  alt="Logo"
                  className={sidebarClasses.logoImage}
                />
                <span className={sidebarClasses.logoText}>
                  Defcon systems
                </span>
                <ChevronDown size={14} className={sidebarClasses.chevronIcon} />
              </div>

              {/* Collapse Button */}
              <button
                className={sidebarClasses.collapseButton}
                onClick={onClose}
              >
                <img src={IMAGES.collapse} alt="Collapse" className={sidebarClasses.collapseImage} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className={sidebarClasses.scrollableContent}>

              {/* Main */}
              <div className={sidebarClasses.mainSection}>
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
                <div className={sidebarClasses.teamspacesTitle}>
                  Teamspaces
                </div>

                {/* Dynamic Teams Section */}
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

                {/* Dynamic Projects Section */}
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

            {/* Footer */}
            <div className={sidebarClasses.footer}>
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
          </>
        )}
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
