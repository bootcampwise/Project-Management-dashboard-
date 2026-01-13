import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { useSettingsModalLogic } from "../../pages/sidebar/hooks/useSettingsModalLogic";
import {
  Select,
  IconButton,
  Input,
  showToast,
  getErrorMessage,
  Avatar,
} from "../ui";
import type { SettingsModalProps, User as UserType } from "../../types";
import { useUpdateTeamMutation } from "../../store/api/teamApiSlice";
import { useDeleteAccountMutation } from "../../store/api/authApiSlice";
import { supabase } from "../../lib/supabase";

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = "Profile",
}) => {
  const {
    user,
    allUsers,
    activeTab,
    formData,
    uploading,
    fileInputRef,
    teams,
    pendingTheme,
    setPendingTheme,
    pendingTimeFormat,
    setPendingTimeFormat,
    handleTabChange,
    handleInputChange,
    handlePhotoUpload,
    handleRemovePhoto,
    handleSave,
    handleLogout,
  } = useSettingsModalLogic(initialTab, onClose);

  const [openTeamDropdown, setOpenTeamDropdown] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<UserType[]>([]);
  const [showTeamPopup, setShowTeamPopup] = useState(false);

  const [updateTeam, { isLoading: isAddingToTeam }] = useUpdateTeamMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(memberSearch.trim().toLowerCase()) ||
      user.email?.toLowerCase().includes(memberSearch.trim().toLowerCase()) ||
      user.jobTitle?.toLowerCase().includes(memberSearch.trim().toLowerCase()),
  );

  const handleInviteClick = () => {
    if (selectedMembers.length === 0) {
      showToast.error("Please select at least one member first");
      return;
    }
    setShowTeamPopup(true);
  };

  const toggleMemberSelection = (member: UserType) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleAddToTeam = async (teamId: string) => {
    if (selectedMembers.length === 0) return;

    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    try {
      const existingMemberIds =
        team.memberIds || team.members?.map((m) => m.id) || [];

      const newMemberIds = selectedMembers
        .filter((m) => !existingMemberIds.includes(m.id))
        .map((m) => m.id);

      if (newMemberIds.length === 0) {
        showToast.error("All selected members are already in this team");
        return;
      }

      await updateTeam({
        id: teamId,
        data: { memberIds: [...existingMemberIds, ...newMemberIds] },
      }).unwrap();

      const addedCount = newMemberIds.length;
      showToast.success(
        `Added ${addedCount} member${addedCount > 1 ? "s" : ""} to ${team.name}`,
      );
      setShowTeamPopup(false);
      setSelectedMembers([]);
      setMemberSearch("");
    } catch (error) {
      showToast.error(`Failed to add members. ${getErrorMessage(error)}`);
    }
  };

  const handleDeleteAccount = () => {
    showToast.confirm({
      title: "Delete Account",
      message:
        "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.",
      confirmText: "Delete Account",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteAccount().unwrap();
          await supabase.auth.signOut();
          onClose();
          localStorage.setItem("accountDeleted", "true");
          window.location.href = "/login";
        } catch (error) {
          showToast.error(
            `Failed to delete account. ${getErrorMessage(error)}`,
          );
        }
      },
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-5xl h-[600px] flex overflow-hidden z-10 text-left">
          <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 p-6">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Settings
              </h3>
              <nav className="space-y-1">
                {["Profile", "General", "Notifications"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Workspace
              </h3>
              <nav className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  Teamspaces
                </button>
                <button
                  onClick={() => handleTabChange("Members")}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "Members"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Members
                </button>
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  Integrations
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {activeTab}
              </h2>
              <IconButton
                icon={<X size={20} />}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {activeTab === "Profile" && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full flex items-center justify-center border border-gray-100 overflow-hidden">
                        <Avatar
                          src={user?.avatar}
                          name={user?.name || user?.email}
                          size="xl"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : "Upload new photo"}
                          </button>
                          <span className="text-gray-300">•</span>
                          <button
                            onClick={handleRemovePhoto}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Remove photo
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">
                          Pick a photo up to 4MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Input
                    type="text"
                    id="name"
                    label="Full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="text"
                    id="jobTitle"
                    label="Job title"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="Product designer"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Team
                    </label>
                    <Select
                      id="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Select a team"
                      options={
                        teams && teams.length > 0
                          ? teams.map((team) => ({
                              value: team.name,
                              label: team.name,
                            }))
                          : [
                              {
                                value: "",
                                label: "No teams found",
                                disabled: true,
                              },
                            ]
                      }
                    />
                  </div>
                  <Input
                    type="email"
                    label="Email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
              )}

              {activeTab === "General" && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Theme
                    </label>
                    <Select
                      value={pendingTheme}
                      onChange={(e) =>
                        setPendingTheme(e.target.value as "light" | "dark")
                      }
                      options={[
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Language
                    </label>
                    <Select
                      defaultValue="English"
                      options={[
                        { value: "English", label: "English" },
                        { value: "Spanish", label: "Spanish" },
                        { value: "French", label: "French" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Time zone
                    </label>
                    <Select
                      defaultValue="Islamabad"
                      options={[
                        { value: "Islamabad", label: "Islamad" },
                        { value: "UTC", label: "UTC" },
                        { value: "EST", label: "EST (Eastern Standard Time)" },
                        { value: "PST", label: "PST (Pacific Standard Time)" },
                        { value: "GMT", label: "GMT (Greenwich Mean Time)" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Time format
                    </label>
                    <Select
                      value={pendingTimeFormat}
                      onChange={(e) =>
                        setPendingTimeFormat(e.target.value as "12h" | "24h")
                      }
                      options={[
                        { value: "12h", label: "1:00 PM" },
                        { value: "24h", label: "13:00" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Date Format
                    </label>
                    <Select
                      defaultValue="DD-MM-YYYY"
                      options={[
                        { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
                        { value: "MM-DD-YYYY", label: "MM-DD-YYYY" },
                        { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                      ]}
                    />
                  </div>
                </div>
              )}

              {activeTab === "Members" && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Invite members
                    </label>
                    <div className="flex gap-3 items-center">
                      {selectedMembers.length > 0 ? (
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex-wrap">
                          {selectedMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-md"
                            >
                              <span className="text-sm font-medium text-blue-800">
                                {member.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMemberSelection(member);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Input
                          type="text"
                          placeholder="Search and click members below to select..."
                          className="flex-1"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                        />
                      )}
                      <button
                        className={`px-6 py-2 rounded-md text-sm font-medium shadow-sm transition-colors ${
                          selectedMembers.length > 0
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={handleInviteClick}
                        disabled={
                          selectedMembers.length === 0 || isAddingToTeam
                        }
                      >
                        {isAddingToTeam
                          ? "Adding..."
                          : `Invite${
                              selectedMembers.length > 1
                                ? ` (${selectedMembers.length})`
                                : ""
                            }`}
                      </button>
                    </div>
                    {selectedMembers.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Click on members below to select them (you can select
                        multiple)
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {memberSearch
                          ? "No members found matching your search."
                          : "No members yet."}
                      </div>
                    ) : (
                      filteredUsers.map((member) => {
                        const memberTeams = teams.filter(
                          (t) =>
                            t.memberIds?.includes(member.id) ||
                            t.members?.some((m) => m.id === member.id),
                        );
                        const teamCount = memberTeams.length;

                        return (
                          <div
                            key={member.id}
                            className={`flex items-center justify-between py-3 px-2 rounded-lg transition-colors cursor-pointer ${
                              selectedMembers.some((m) => m.id === member.id)
                                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => toggleMemberSelection(member)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  selectedMembers.some(
                                    (m) => m.id === member.id,
                                  )
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedMembers.some(
                                  (m) => m.id === member.id,
                                ) && <Check size={12} className="text-white" />}
                              </div>
                              <div className="rounded-full overflow-hidden flex items-center justify-center">
                                <Avatar
                                  src={member.avatar}
                                  name={member.name || member.email}
                                  size="lg"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {member.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {member.jobTitle || "Team Member"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="relative">
                                <button
                                  className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenTeamDropdown(
                                      openTeamDropdown === member.id
                                        ? null
                                        : member.id,
                                    );
                                  }}
                                >
                                  <span>
                                    {teamCount} Teamspace
                                    {teamCount !== 1 ? "s" : ""}
                                  </span>
                                  <svg
                                    className={`w-4 h-4 transition-transform ${
                                      openTeamDropdown === member.id
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>

                                {openTeamDropdown === member.id &&
                                  teamCount > 0 && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                                        Teams
                                      </div>
                                      {memberTeams.map((team) => (
                                        <div
                                          key={team.id}
                                          className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                          {team.name}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>

                              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-right">
                                Member
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeTab === "Notifications" && (
                <div className="max-w-2xl space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Activity updates
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        New tasks assigned to you, @mentions, and completion
                        notifications for tasks you're a collaborator on
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Mentions
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        New tasks assigned to you, direct messages, and
                        @mentions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Emails
                    </h3>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Daily digest
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Personalized productivity stats plus your tasks due
                        today.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Tips and tricks
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Powerful productivity advice in your inbox. Sent once a
                        month.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
              {activeTab === "Profile" && (
                <div className="flex gap-2">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 border border-red-200"
                  >
                    Log out
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 border border-red-200"
                  >
                    Delete account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTeamPopup && selectedMembers.length > 0 && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowTeamPopup(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add {selectedMembers.length} Member
                {selectedMembers.length > 1 ? "s" : ""} to Team
              </h3>
              <button
                onClick={() => setShowTeamPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Selected: {selectedMembers.map((m) => m.name).join(", ")}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Select a team to add{" "}
              {selectedMembers.length > 1 ? "them" : "this member"} to:
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {teams.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No teams available. Create a team first.
                </div>
              ) : (
                teams.map((team) => {
                  const existingMemberIds =
                    team.memberIds || team.members?.map((m) => m.id) || [];
                  const alreadyInTeam = selectedMembers.filter((m) =>
                    existingMemberIds.includes(m.id),
                  ).length;
                  const allAlreadyMembers =
                    alreadyInTeam === selectedMembers.length;

                  return (
                    <button
                      key={team.id}
                      onClick={() =>
                        !allAlreadyMembers && handleAddToTeam(team.id)
                      }
                      disabled={allAlreadyMembers || isAddingToTeam}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                        allAlreadyMembers
                          ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          allAlreadyMembers ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {team.name}
                      </span>
                      {alreadyInTeam > 0 && (
                        <span className="text-xs text-gray-400">
                          {allAlreadyMembers
                            ? "All already members"
                            : `${alreadyInTeam} already member${
                                alreadyInTeam > 1 ? "s" : ""
                              }`}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowTeamPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
