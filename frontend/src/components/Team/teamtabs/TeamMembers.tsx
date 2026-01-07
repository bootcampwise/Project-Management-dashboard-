import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { listContainerVariants, listItemVariants } from "../../../utils/motion";
import type { TeamMembersProps } from "../../../types";
import { useUpdateTeamMutation } from "../../../store/api/teamApiSlice";
import { showToast, getErrorMessage } from "../../ui";

const TeamMembers: React.FC<TeamMembersProps> = ({
  members,
  isLoading = false,
  teamId,
  allMemberIds = [],
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [updateTeam, { isLoading: isRemoving }] = useUpdateTeamMutation();

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!teamId) {
      showToast.error("Cannot remove member: Team ID not available");
      return;
    }

    try {
      const updatedMemberIds = allMemberIds.filter((id) => id !== memberId);

      await updateTeam({
        id: teamId,
        data: { memberIds: updatedMemberIds },
      }).unwrap();

      showToast.success(`Removed ${memberName} from the team`);
      setOpenMenuId(null);
    } catch (error) {
      showToast.error(`Failed to remove member. ${getErrorMessage(error)}`);
    }
  };

  const getGroupStyle = (group: string) => {
    const lowerGroup = group.toLowerCase();
    if (lowerGroup.includes("development") || lowerGroup.includes("dev")) {
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    }
    if (lowerGroup.includes("design") || lowerGroup.includes("product")) {
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
    }
    if (lowerGroup.includes("marketing")) {
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
    }
    if (lowerGroup.includes("qa") || lowerGroup.includes("test")) {
      return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400";
    }
    if (lowerGroup.includes("admin") || lowerGroup.includes("management")) {
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    }
    if (lowerGroup.includes("support")) {
      return "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400";
    }
    return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-900 flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500 dark:text-gray-400">
          Loading members...
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-900">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_60px] gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div>Name</div>
          <div>Position</div>
          <div>Team groups</div>
          <div>Location</div>
          <div></div>
        </div>

        <motion.div
          className="flex flex-col gap-[2px] bg-gray-50 dark:bg-gray-800"
          variants={listContainerVariants}
          initial="hidden"
          animate="show"
        >
          {members.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm italic bg-white dark:bg-gray-900">
              No members found for this team.
            </div>
          ) : (
            members.map((member) => (
              <motion.div
                key={member.id}
                className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_60px] gap-4 px-6 h-[40px] items-center bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                variants={listItemVariants}
              >
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {member.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {member.name}
                      </span>
                      {member.email && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {member.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Member
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${getGroupStyle(
                      "team",
                    )}`}
                  >
                    Team Member
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Not specified
                </div>
                <div className="relative flex justify-end">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === member.id ? null : member.id)
                    }
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === member.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() =>
                          handleRemoveMember(String(member.id), member.name)
                        }
                        disabled={isRemoving}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {isRemoving ? "Removing..." : "Remove Member"}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TeamMembers;
