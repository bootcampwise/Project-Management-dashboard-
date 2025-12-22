import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { DashboardStatCardProps } from '../../types';

const StatCard: React.FC<DashboardStatCardProps> = ({ title, count, trend, points }) => {
    const isPositive = trend === 'positive';

    return (
        <div
            className="rounded-xl shadow-sm border border-gray-100/60 flex items-center justify-between p-4 w-full"
            style={{
                height: '88px',
                backgroundColor: '#F9FAFA'
            }}
        >
            <div className="flex flex-col justify-between h-full">
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>

                {/* Trend Chip */}
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium w-fit ${isPositive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                    }`}>
                    {isPositive
                        ? <ArrowUpRight size={12} />
                        : <ArrowDownRight size={12} />
                    }
                    <span>{isPositive ? '+' : '-'}{points} points since yesterday</span>
                </div>
            </div>

            <span className="text-4xl font-semibold text-gray-800">{count}</span>
        </div>
    );
};

const StatsGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] p-[1px]">
            {/* Card 1: Total Tasks */}
            <StatCard
                title="Total Tasks"
                count="1050"
                trend="positive"
                points="3"
            />
            {/* Card 2: To Do Tasks */}
            <StatCard
                title="To Do Tasks"
                count="87"
                trend="negative"
                points="3"
            />
            {/* Card 3: In Progress Tasks */}
            <StatCard
                title="In Progress Tasks"
                count="95"
                trend="positive"
                points="3"
            />
            {/* Card 4: Cancelled Tasks */}
            <StatCard
                title="Cancelled Tasks"
                count="585"
                trend="negative"
                points="3"
            />
        </div>
    );
};

export default StatsGrid;
