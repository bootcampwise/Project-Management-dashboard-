import React, { useState } from 'react';
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import type { TeamMembersProps } from '../../../types';
import { useUpdateTeamMutation } from '../../../store/api/teamApiSlice';
import { showToast, getErrorMessage } from '../../ui';

const TeamMembers: React.FC<TeamMembersProps> = ({ members, isLoading = false, teamId, allMemberIds = [] }) => {
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [updateTeam, { isLoading: isRemoving }] = useUpdateTeamMutation();

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!teamId) {
      showToast.error('Cannot remove member: Team ID not available');
      return;
    }

    try {
      // Filter out the member being removed
      const updatedMemberIds = allMemberIds.filter(id => id !== memberId);

      await updateTeam({
        id: teamId,
        data: { memberIds: updatedMemberIds }
      }).unwrap();

      showToast.success(`Removed ${memberName} from the team`);
      setOpenMenuId(null);
    } catch (error) {
      showToast.error(`Failed to remove member. ${getErrorMessage(error)}`);
    }
  };

  const getGroupStyle = (group: string) => {
    const lowerGroup = group.toLowerCase();
    if (lowerGroup.includes('development') || lowerGroup.includes('dev')) {
      return 'bg-blue-100 text-blue-700';
    }
    if (lowerGroup.includes('design') || lowerGroup.includes('product')) {
      return 'bg-purple-100 text-purple-700';
    }
    if (lowerGroup.includes('marketing')) {
      return 'bg-orange-100 text-orange-700';
    }
    if (lowerGroup.includes('qa') || lowerGroup.includes('test')) {
      return 'bg-pink-100 text-pink-700';
    }
    if (lowerGroup.includes('admin') || lowerGroup.includes('management')) {
      return 'bg-green-100 text-green-700';
    }
    if (lowerGroup.includes('support')) {
      return 'bg-teal-100 text-teal-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Loading members...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_60px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div>Name</div>
          <div>Position</div>
          <div>Team groups</div>
          <div>Location</div>
          <div></div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-[2px] bg-gray-50">
          {members.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm italic bg-white">
              No members found for this team.
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_60px] gap-4 px-6 h-[40px] items-center bg-white hover:bg-gray-50 transition-colors">
                {/* Name Column */}
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {member.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-gray-800">{member.name}</span>
                      {member.email && (
                        <span className="text-xs text-gray-400">{member.email}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div className="text-sm text-gray-600">
                  Member
                </div>

                {/* Team Groups */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getGroupStyle('team')}`}>
                    Team Member
                  </span>
                </div>

                {/* Location */}
                <div className="text-sm text-gray-600">
                  Not specified
                </div>

                {/* Actions Column */}
                <div className="relative flex justify-end">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === member.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() => handleRemoveMember(String(member.id), member.name)}
                        disabled={isRemoving}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {isRemoving ? 'Removing...' : 'Remove Member'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
