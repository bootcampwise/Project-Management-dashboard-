import React from 'react';
import { ChevronDown, List, Calendar, Layout } from 'lucide-react';
import type { ProjectEarning } from '../../../types';


const TopEarning: React.FC = () => {
    const projects: ProjectEarning[] = [
        {
            id: '1',
            name: 'Development',
            completedTasks: 72,
            earning: 3340.21,
            iconColor: 'teal'
        },
        {
            id: '2',
            name: 'Directions',
            completedTasks: 57,
            earning: 2800.30,
            iconColor: 'blue'
        },
        {
            id: '3',
            name: 'Product calendar',
            completedTasks: 40,
            earning: 2100.11,
            iconColor: 'orange'
        },
        {
            id: '4',
            name: 'Design references',
            completedTasks: 28,
            earning: 1900.90,
            iconColor: 'gray'
        },
        {
            id: '5',
            name: 'Product calendar',
            completedTasks: 40,
            earning: 2100.11,
            iconColor: 'orange'
        }
    ];

    const getIconBackground = (color: string) => {
        switch (color) {
            case 'teal':
                return 'bg-teal-500';
            case 'blue':
                return 'bg-blue-400';
            case 'orange':
                return 'bg-orange-400';
            case 'gray':
                return 'bg-gray-300';
            default:
                return 'bg-gray-300';
        }
    };

    const getIcon = (project: ProjectEarning) => {
        if (project.name === 'Product calendar') {
            return <Calendar className="w-6 h-6 text-white" strokeWidth={2} />;
        } else if (project.name === 'Design references') {
            return <Layout className="w-6 h-6 text-white" strokeWidth={2} />;
        } else {
            return <List className="w-6 h-6 text-white" strokeWidth={2} />;
        }
    };

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 w-full h-full flex flex-col"
            style={{ padding: '6px' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-2 pt-2 flex-shrink-0">
                <h3 className="text-lg font-medium text-gray-700">Top earning</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <span>This month</span>
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* Projects List */}
            <div className="space-y-0 flex-1 overflow-y-auto scrollbar-hide">
                {projects.map((project, index) => (
                    <div
                        key={`${project.id}-${index}`}
                        className="w-full flex items-center justify-between mx-auto px-1"
                        style={{ height: '52px', borderBottomWidth: '1px', borderColor: '#f3f4f6' }}
                    >
                        {/* Left: Icon, Name, Tasks */}
                        <div className="flex items-center gap-3 overflow-hidden">
                            {/* Icon */}
                            <div className={`w-8 h-8 rounded-lg ${getIconBackground(project.iconColor)} flex items-center justify-center flex-shrink-0`}>
                                {getIcon(project)}
                            </div>

                            {/* Name and Tasks */}
                            <div className="flex flex-col justify-center overflow-hidden min-w-0 gap-[5px]">
                                <span className="text-[13px] font-medium text-gray-700 truncate leading-none">
                                    {project.name}
                                </span>
                                <span className="text-[10px] text-gray-400 truncate leading-none">
                                    {project.completedTasks} completed tasks
                                </span>
                            </div>
                        </div>

                        {/* Right: Earning */}
                        <div className="text-sm font-medium text-gray-700 whitespace-nowrap ml-2">
                            ${project.earning.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopEarning;
