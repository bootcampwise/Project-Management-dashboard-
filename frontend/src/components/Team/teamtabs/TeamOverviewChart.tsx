import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const TeamOverviewChart: React.FC = () => {
  const chartData = [
    { month: "Jan", value: 12000, isHighlighted: false },
    { month: "Feb", value: 18000, isHighlighted: false },
    { month: "Mar", value: 14000, isHighlighted: false },
    { month: "Apr", value: 16000, isHighlighted: false },
    { month: "May", value: 13000, isHighlighted: false },
    { month: "Jun", value: 28000, isHighlighted: true },
    { month: "Jul", value: 11000, isHighlighted: false },
    { month: "Aug", value: 19000, isHighlighted: false },
    { month: "Sep", value: 9000, isHighlighted: false },
    { month: "Oct", value: 17000, isHighlighted: false },
    { month: "Nov", value: 12000, isHighlighted: false },
    { month: "Dec", value: 15000, isHighlighted: false },
  ];

  // Calculate total
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full lg:flex-1 h-[333px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-700">Overview</h3>
        <select className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white">
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>

      {/* Total Amount */}
      <div className="text-3xl font-semibold text-gray-900 mb-6">
        ${total.toLocaleString()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Billable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          <span className="text-sm text-gray-600">Non-billable</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          barSize={40}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 13 }}
            dy={10}
          />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isHighlighted ? '#3B82F6' : '#E5E7EB'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamOverviewChart;
