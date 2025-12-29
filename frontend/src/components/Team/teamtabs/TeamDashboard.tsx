import React from 'react';
import { ChevronDown } from 'lucide-react';
import TeamOverviewChart from './TeamOverviewChart';
import TopCompletedTasks from './TopCompletedTasks';
import TimelineView from '../../projectBoard/TimelineView';
import TopEarning from './TopEarning';
import { StatCard } from '../../ui';


const TeamDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-normal text-gray-600 dark:text-gray-400">Teamspace overview</h2>

        {/* Dropdown */}
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <span>All projects</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Completed tasks"
          value="127"
          trend="positive"
          trendText="67/18%"
        />
        <StatCard
          title="Incompleted tasks"
          value="62"
          trend="negative"
          trendText="54.29%"
        />
        <StatCard
          title="Overdue tasks"
          value="20"
          trendText="14/11%"
        />
        <StatCard
          title="Total income"
          value="$15,302"
          trend="positive"
          trendText="2/18%"
        />
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Overview Chart - Left Side */}
        <TeamOverviewChart />

        {/* Top Completed Tasks - Right Side */}
        <TopCompletedTasks />
      </div>

      {/* Timeline Section */}
      <div className="flex flex-col lg:flex-row gap-[11px]">
        {/* Timeline - Left Side - Flexible width and Fixed 336px height */}
        <div className="w-full lg:flex-1 lg:w-[370px] lg:h-[345px] ">
          <TimelineView />
        </div>

        {/* Top Earning - Right Side - Fixed 345px width and 336px height */}
        <div className="w-full lg:w-[315px] lg:h-[345px]">
          <TopEarning />
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
