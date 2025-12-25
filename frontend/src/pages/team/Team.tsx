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
import TeamTableView from "../../components/team/teamtabs/TeamTableView";
import TeamDashboard from "../../components/team/teamtabs/TeamDashboard";
import TeamMembers from "../../components/team/teamtabs/TeamMembers";
import TeamFiles from "../../components/team/teamtabs/TeamFiles";
import CreateTeamModal from "../../components/team/CreateTeamModal";
import SearchPopup from "../../components/sidebar/SearchPopup";
import {
  showToast,
  Button,
  Dropdown,
  type DropdownItem,
  TeamPageSkeleton,
} from "../../components/ui";

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
    projectsLoading,
    activeProject,

    menuRef,
    handleSwitchProject,
    handleDeleteProject,
  } = useTeam();

  // Show full page skeleton if initial loading
  if (projectsLoading) {
    return (
      <div className={teamClasses.container}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={teamClasses.main}>
          <div className={teamClasses.mainContent(sidebarOpen)}>
            <TeamPageSkeleton />
          </div>
        </main>
      </div>
    );
  }

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
                {/* Project Switcher Dropdown */}
                <Dropdown
                  trigger={
                    <div className={teamClasses.headerTitleClickable}>
                      <h1 className={teamClasses.headerTitle}>{activeProject?.name || "No Projects"}</h1>
                      <ChevronDown size={16} className={teamClasses.chevronIcon(false)} />
                    </div>
                  }
                  items={[
                    { key: 'header', label: 'Switch Project', header: true },
                    ...projects.map(p => ({
                      key: p.id,
                      label: (
                        <div className="flex items-center justify-between w-full">
                          <span className={teamClasses.dropdownItemText}>{p.name}</span>
                          {activeProject?.id === p.id && <Check size={14} />}
                        </div>
                      ),
                      onClick: () => handleSwitchProject(p)
                    })),
                    { key: 'div1', divider: true } as DropdownItem,
                    {
                      key: 'create',
                      label: 'Create New Project',
                      icon: <Plus size={14} />,
                      onClick: () => setIsCreateTeamModalOpen(true)
                    }
                  ]}
                />

                <Star className={teamClasses.starIcon} size={18} />

                <div className="relative">
                  <Dropdown
                    align="right"
                    trigger={
                      <button className={teamClasses.menuIconButton}>
                        <MoreHorizontal className={teamClasses.menuIconColor} size={18} />
                      </button>
                    }
                    items={[
                      {
                        key: 'active-project',
                        custom: true,
                        label: (
                          <div className={teamClasses.menuDropdownHeader}>
                            <p className={teamClasses.menuDropdownLabel}>Active Project</p>
                            <p className={teamClasses.menuDropdownValue}>{activeProject?.name || "None"}</p>
                          </div>
                        )
                      },
                      { key: 'switch', label: 'Switch Project', icon: <ChevronRight size={14} />, onClick: () => { /* Handle focus? */ } },
                      {
                        key: 'delete',
                        label: 'Delete Project',
                        danger: true,
                        icon: <Trash2 size={14} />,
                        onClick: () => {
                          showToast.custom((t) => (
                            <div className={teamClasses.toastContainer}>
                              <div>
                                <h3 className={teamClasses.toastTitle}>Delete Project?</h3>
                                <p className={teamClasses.toastDescription}>
                                  Are you sure you want to delete <span className="font-semibold">{activeProject?.name}</span>? This action cannot be undone.
                                </p>
                              </div>
                              <div className={teamClasses.toastActions}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => showToast.dismiss(t.id)}
                                  className={teamClasses.toastCancelButton}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => {
                                    showToast.dismiss(t.id);
                                    if (activeProject) {
                                      handleDeleteProject(activeProject.id);
                                    }
                                  }}
                                  className={teamClasses.toastDeleteButton}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ), teamStyles.toastOptions);
                        }
                      }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={teamClasses.actionsWrapper}>
              <Button
                variant="secondary"
                className={teamClasses.shareButton}
                leftIcon={<Share2 size={16} />}
              >
                <span className={teamClasses.toolText}>Share</span>
              </Button>
              <Button
                variant="primary"
                className={teamClasses.createButton}
                onClick={() => setIsCreateTeamModalOpen(true)}
                rightIcon={<ChevronDown size={14} className={teamClasses.createButtonChevron} />}
              >
                <span>Create</span>
              </Button>
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
