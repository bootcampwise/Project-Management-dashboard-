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
  Trash2,
  Pencil,
} from "lucide-react";
import TeamTableView from "../../components/team/teamtabs/TeamTableView";
import TeamProjects from "../../components/team/teamtabs/TeamProjects";
import TeamDashboard from "../../components/team/teamtabs/TeamDashboard";
import TeamMembers from "../../components/team/teamtabs/TeamMembers";
import TeamFiles from "../../components/team/teamtabs/TeamFiles";
import CreateTeamModal from "../../components/team/CreateTeamModal";
import SearchPopup from "../../components/sidebar/SearchPopup";
import {
  showToast,
  Button,
  Dropdown,
  TeamPageSkeleton,
} from "../../components/ui";
import SortControl from "../../components/ui/SortControl";
import FilterControl from "../../components/ui/FilterControl";

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
    allTeams,
    activeTeam,
    teamsLoading,

    menuRef,
    handleDeleteTeam,
    handleToggleTeamFavorite,
    handleOpenCreateTeamModal,
    handleEditTeam,
    teamToEdit,
    teamFiles, // Destructure the file hook data
  } = useTeam();

  // Local filter/sort state for Team page
  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest' | 'alpha'>('newest');
  const [filterPriority, setFilterPriority] = React.useState<string | null>(null);

  // Sort projects based on sortBy
  const sortedProjects = React.useMemo(() => {
    const projects = [...(activeTeam?.projects || [])];
    return projects.sort((a, b) => {
      if (sortBy === 'alpha') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'oldest') {
        return new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime();
      }
      // newest (default)
      return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime();
    });
  }, [activeTeam?.projects, sortBy]);

  // Sort members based on sortBy
  const sortedMembers = React.useMemo(() => {
    const displayMembers = activeTeam
      ? (activeTeam.members || [])
      : Array.from(
        new Map(
          allTeams.flatMap(t => t.members || []).map(m => [m.id, m])
        ).values()
      );

    return [...displayMembers].sort((a, b) => {
      if (sortBy === 'alpha') {
        return (a.name || '').localeCompare(b.name || '');
      }
      // For members, newest/oldest can use position or just keep current order
      return 0;
    });
  }, [activeTeam, allTeams, sortBy]);

  // Show full page skeleton if initial loading
  if (teamsLoading) {
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
                {/* Team Title (Static) */}
                <div className={teamClasses.headerTitleClickable}>
                  <h1 className={teamClasses.headerTitle}>{activeTeam?.name || "All Teams"}</h1>
                </div>

                {activeTeam && (
                  <>
                    <Star
                      className={`${teamClasses.starIcon} cursor-pointer hover:text-yellow-400 transition-colors ml-2`}
                      size={18}
                      onClick={handleToggleTeamFavorite}
                    />

                    <div className="relative ml-2">
                      <Dropdown
                        align="right"
                        trigger={
                          <button className={teamClasses.menuIconButton}>
                            <MoreHorizontal className={teamClasses.menuIconColor} size={18} />
                          </button>
                        }
                        items={[
                          {
                            key: 'active-team-info',
                            custom: true,
                            label: (
                              <div className={teamClasses.menuDropdownHeader}>
                                <p className={teamClasses.menuDropdownLabel}>Active Team</p>
                                <p className={teamClasses.menuDropdownValue}>{activeTeam.name}</p>
                              </div>
                            )
                          },
                          {
                            key: 'edit',
                            label: 'Edit Team',
                            icon: <Pencil size={14} />,
                            onClick: () => handleEditTeam(activeTeam)
                          },
                          {
                            key: 'delete',
                            label: 'Delete Team',
                            danger: true,
                            icon: <Trash2 size={14} />,
                            onClick: () => {
                              showToast.custom((t) => (
                                <div className={teamClasses.toastContainer}>
                                  <div>
                                    <h3 className={teamClasses.toastTitle}>Delete Team?</h3>
                                    <p className={teamClasses.toastDescription}>
                                      Are you sure you want to delete <span className="font-semibold">{activeTeam.name}</span>? This action cannot be undone.
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
                                        handleDeleteTeam(activeTeam.id);
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
                  </>
                )}
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
                onClick={handleOpenCreateTeamModal}
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
              <FilterControl
                value={filterPriority}
                onChange={setFilterPriority}
                label="Filters"
                options={[
                  { key: 'all', label: 'All', value: null },
                  { key: 'urgent', label: 'Urgent', value: 'URGENT' },
                  { key: 'high', label: 'High', value: 'HIGH' },
                  { key: 'medium', label: 'Medium', value: 'MEDIUM' },
                  { key: 'low', label: 'Low', value: 'LOW' },
                ]}
              />
              <SortControl
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { key: 'newest', label: 'Newest' },
                  { key: 'oldest', label: 'Oldest' },
                  { key: 'alpha', label: 'A-Z' },
                ]}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className={teamClasses.contentArea}>
            {activeTab === "Teams" && <TeamTableView filteredTeamId={activeTeam?.id} sortBy={sortBy} />}
            {activeTab === "Projects" && <TeamProjects projects={sortedProjects} />}
            {activeTab === "Dashboard" && <TeamDashboard />}
            {activeTab === "Members" && <TeamMembers
              members={sortedMembers}
              teamId={activeTeam?.id}
              allMemberIds={activeTeam?.memberIds || activeTeam?.members?.map(m => String(m.id))}
            />}
            {activeTab === "Files" && <TeamFiles
              allTeams={allTeams}
              {...teamFiles} // Pass all file-related props from the hook
            />}
          </div>

        </div>
      </main>
      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} showProjects={false} />
      <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} teamToEdit={teamToEdit} />
    </div>
  );
};

export default Team;
