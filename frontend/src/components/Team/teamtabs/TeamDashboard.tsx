import React from 'react';
import { ChevronDown } from 'lucide-react';
import TeamOverviewChart from './TeamOverviewChart';
import TopCompletedTasks from './TopCompletedTasks';
import TimelineView from '../ProjectBoard/TimelineView';
import TopEarning from './TopEarning';
import type { TeamStatCardProps } from '../../types';


const TeamStatCard: React.FC<TeamStatCardProps> = ({ title, value, percentage, percentageColor }) => {
    const getPercentageColor = () => {
        switch (percentageColor) {
            case 'blue':
                return 'text-blue-500';
            case 'red':
                return 'text-red-500';
            case 'gray':
                return 'text-gray-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Title */}
            <h3 className="text-xs text-gray-400 font-normal mb-3">{title}</h3>

            {/* Value and Percentage Row */}
            <div className="flex items-end justify-between">
                {/* Value */}
                <div className="text-3xl font-semibold text-gray-900">
                    {value}
                </div>

                {/* Percentage */}
                <div className={`text-sm font-normal ${getPercentageColor()}`}>
                    {percentage}
                </div>
            </div>
        </div>
    );
};

const TeamDashboard: React.FC = () => {
    return (
        <div className="p-6 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-normal text-gray-600">Teamspace overview</h2>

                {/* Dropdown */}
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <span>All projects</span>
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <TeamStatCard
                    title="Completed tasks"
                    value="127"
                    percentage="67/18%"
                    percentageColor="blue"
                />
                <TeamStatCard
                    title="Incompleted tasks"
                    value="62"
                    percentage="54.29%"
                    percentageColor="red"
                />
                <TeamStatCard
                    title="Overdue tasks"
                    value="20"
                    percentage="14/11%"
                    percentageColor="gray"
                />
                <TeamStatCard
                    title="Total income"
                    value="$15,302"
                    percentage="2/18%"
                    percentageColor="blue"
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
