import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: 'positive' | 'negative';
  trendText?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendText,
  className = '',
}) => {
  const isPositive = trend === 'positive';

  return (
    <div
      className={`
        rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 
        flex items-center justify-between p-4 w-full
        bg-gray-50 dark:bg-gray-800
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={{ height: '88px' }}
    >
      <div className="flex flex-col justify-between h-full">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>

        {trend && trendText && (
          <div
            className={`
              flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium w-fit
              ${isPositive ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}
            `.trim()}
          >
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{trendText}</span>
          </div>
        )}
      </div>

      <span className="text-4xl font-semibold text-gray-800 dark:text-white">{value}</span>
    </div>
  );
};

StatCard.displayName = 'StatCard';
