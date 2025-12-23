import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { TopTasksMember } from '../../../types';

const TopCompletedTasks: React.FC = () => {
  const teamMembers: TopTasksMember[] = [
    {
      id: '1',
      name: 'Hanna Rodgers',
      role: 'QA Lead',
      tasksCompleted: 24,
      avatar: '/avatars/hanna.jpg'
    },
    {
      id: '2',
      name: 'Henry Rollins',
      role: 'Support',
      tasksCompleted: 20,
      avatar: '/avatars/henry.jpg'
    },
    {
      id: '3',
      name: 'William Atkins',
      role: 'Product Marketing',
      tasksCompleted: 18,
      avatar: '/avatars/william.jpg'
    },
    {
      id: '4',
      name: 'Mandy Harley',
      role: 'API Lead',
      tasksCompleted: 16,
      avatar: '/avatars/mandy.jpg'
    },
    {
      id: '5',
      name: 'Dylan Westhan',
      role: 'Frontend',
      tasksCompleted: 13,
      avatar: '/avatars/dylan.jpg'
    }
  ];

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 w-full lg:w-[336px] h-[328px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-700">Top completed tasks</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <span>This week</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            {/* Left: Avatar, Name, Role */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold text-sm">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name and Role */}
              <div className="flex flex-col gap-[2px]">
                <span className="text-[13px] font-medium text-gray-700 leading-none">
                  {member.name}
                </span>
                <span className="text-[10px] text-gray-400 leading-none">
                  {member.role}
                </span>
              </div>
            </div>

            {/* Right: Task Count */}
            <div className="text-base font-normal text-gray-600">
              {member.tasksCompleted}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCompletedTasks;
