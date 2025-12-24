import React from "react";
import { useTeam } from "./hooks/useTeam";
import { teamClasses, teamStyles } from "./teamStyle";
import Sidebar from "../sidebar/Sidebar";
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
import TeamTableView from "../../components/team/teamtabs/TeamTableView";
import TeamDashboard from "../../components/team/teamtabs/TeamDashboard";
import TeamMembers from "../../components/team/teamtabs/TeamMembers";
import TeamFiles from "../../components/team/teamtabs/TeamFiles";
import CreateTeamModal from "../../components/team/CreateTeamModal";
import SearchPopup from "../../components/sidebar/SearchPopup";

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
    <div className={teamClasses.container}>
      {/* Mobile menu button */}
      <button
        className={teamClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className={teamClasses.main}>
        <div className={teamClasses.mainContent(sidebarOpen)}>

          {/* Header Top Row */}
          <div className={teamClasses.headerWrapper}>
            {/* Title & Status */}
            <div className={teamClasses.headerTitleWrapper}>
              <div className={teamClasses.headerMenuWrapper} ref={menuRef}>
                <div
                  className={teamClasses.headerTitleClickable}
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                >
                  <h1 className={teamClasses.headerTitle}>{activeProject?.name || "No Projects"}</h1>
                  <ChevronDown size={16} className={teamClasses.chevronIcon(isProjectDropdownOpen)} />
                </div>

                {/* Project Switcher Dropdown */}
                {isProjectDropdownOpen && (
                  <div className={teamClasses.dropdown}>
                    <div className={teamClasses.dropdownHeader}>
                      Switch Project
                    </div>
                    {projects.map(p => (
                      <button
                        key={p.id}
                        className={teamClasses.dropdownItem(activeProject?.id === p.id)}
                        onClick={() => handleSwitchProject(p)}
                      >
                        <span className={teamClasses.dropdownItemText}>{p.name}</span>
                        {activeProject?.id === p.id && <Check size={14} />}
                      </button>
                    ))}
                    {projects.length === 0 && (
                      <div className={teamClasses.dropdownEmpty}>No projects found</div>
                    )}
                    <div className={teamClasses.dropdownDivider}>
                      <button
                        className={teamClasses.dropdownCreateButton}
                        onClick={() => {
                          setIsProjectDropdownOpen(false);
                          setIsCreateTeamModalOpen(true);
                        }}
                      >
                        <Plus size={14} />
                        Create New Project
                      </button>
                    </div>
                  </div>
                )}

                <Star className={teamClasses.starIcon} size={18} />

                <div className="relative">
                  <button
                    className={teamClasses.menuIconButton}
                    onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                  >
                    <MoreHorizontal className={teamClasses.menuIconColor} size={18} />
                  </button>

                  {/* Menu Dropdown */}
                  {isMenuDropdownOpen && (
                    <div className={teamClasses.menuDropdown}>
                      <div className={teamClasses.menuDropdownHeader}>
                        <p className={teamClasses.menuDropdownLabel}>Active Project</p>
                        <p className={teamClasses.menuDropdownValue}>{activeProject?.name || "None"}</p>
                      </div>
                      <button
                        className={teamClasses.menuDropdownItem}
                        onClick={() => {
                          setIsMenuDropdownOpen(false);
                          setIsProjectDropdownOpen(true);
                        }}
                      >
                        <ChevronRight size={14} />
                        Switch Project
                      </button>
                      <button
                        className={teamClasses.menuDropdownDeleteItem}
                        onClick={() => {
                          setIsMenuDropdownOpen(false);
                          toast((t) => (
                            <div className={teamClasses.toastContainer}>
                              <div>
                                <h3 className={teamClasses.toastTitle}>Delete Project?</h3>
                                <p className={teamClasses.toastDescription}>
                                  Are you sure you want to delete <span className="font-semibold">{activeProject?.name}</span>? This action cannot be undone.
                                </p>
                              </div>
                              <div className={teamClasses.toastActions}>
                                <button
                                  onClick={() => toast.dismiss(t.id)}
                                  className={teamClasses.toastCancelButton}
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
                                  className={teamClasses.toastDeleteButton}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ), teamStyles.toastOptions);
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
            <div className={teamClasses.actionsWrapper}>
              <button className={teamClasses.shareButton}>
                <Share2 size={16} />
                <span className={teamClasses.toolText}>Share</span>
              </button>
              <button
                className={teamClasses.createButton}
                onClick={() => setIsCreateTeamModalOpen(true)}
              >
                <span>Create</span>
                <ChevronDown size={14} className={teamClasses.createButtonChevron} />
              </button>
            </div>
          </div>

          {/* Header Bottom Row (Toolbar) */}
          <div className={teamClasses.toolbar}>
            {/* Tabs */}
            <div className={teamClasses.tabsWrapper}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={teamClasses.tab(activeTab === tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tools */}
            <div className={teamClasses.toolsWrapper}>
              <div
                className={teamClasses.toolItem}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={16} />
                <span className={teamClasses.toolText}>Search</span>
              </div>
              <div className={teamClasses.toolDivider}></div>
              <div className={teamClasses.toolItem}>
                <Filter size={16} />
                <span className={teamClasses.toolText}>Filter</span>
              </div>
              <div className={teamClasses.toolItem}>
                <ArrowUpDown size={16} />
                <span className={teamClasses.toolText}>Sort</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className={teamClasses.contentArea}>
            {activeTab === "Teams" && <TeamTableView projectId={activeProject?.id} />}
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
