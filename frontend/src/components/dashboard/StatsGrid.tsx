import React from 'react';
import { StatCard } from '../ui';

const StatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] p-[1px]">
      {/* Card 1: Total Tasks */}
      <StatCard
        title="Total Tasks"
        value="1050"
        trend="positive"
        trendText="+3 points since yesterday"
      />
      {/* Card 2: To Do Tasks */}
      <StatCard
        title="To Do Tasks"
        value="87"
        trend="negative"
        trendText="-3 points since yesterday"
      />
      {/* Card 3: In Progress Tasks */}
      <StatCard
        title="In Progress Tasks"
        value="95"
        trend="positive"
        trendText="+3 points since yesterday"
      />
      {/* Card 4: Cancelled Tasks */}
      <StatCard
        title="Cancelled Tasks"
        value="585"
        trend="negative"
        trendText="-3 points since yesterday"
      />
    </div>
  );
};

export default StatsGrid;
