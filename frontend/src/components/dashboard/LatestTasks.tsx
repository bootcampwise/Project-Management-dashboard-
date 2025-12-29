import React from 'react';
import { ArrowUpDown, FileText } from 'lucide-react';
import type { LatestTask } from '../../types';

const tasks: LatestTask[] = [
  {
    id: 1,
    name: 'Design Landing Page',
    project: 'Wortix',
    subtasks: '0/6',
    status: 'To-Do',
    priority: 'High',
    startDate: 'Jul 10,2025',
    endDate: 'Aug 13,2025'
  },
  {
    id: 2,
    name: 'Write and Automate Multi-Step Onbo...',
    project: 'Sublentix Inc.',
    subtasks: '22/25',
    status: 'Completed',
    priority: 'Medium',
    startDate: 'May 27,2025',
    endDate: 'Aug 10,2025'
  },
  {
    id: 3,
    name: 'Set Up Analytics Integration',
    project: 'Spacebook',
    subtasks: '3/7',
    status: 'To-Do',
    priority: 'Low',
    startDate: 'Jun 27,2025',
    endDate: 'Aug 1,2025'
  },
  {
    id: 4,
    name: 'Write Onboarding Emails',
    project: 'PrimaWire',
    subtasks: '0/7',
    status: 'In Progress',
    priority: 'Medium',
    startDate: 'Jun 3, 2025',
    endDate: 'Aug 3, 2025'
  }
];

const LatestTasks: React.FC = () => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-3 flex flex-col overflow-hidden w-full h-[260px]"
    >
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Latest Tasks</h3>

      <div className="overflow-x-auto flex-1 w-full">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#F7F9FB] dark:bg-gray-700">
            <tr>
              <th className="py-1 px-3 text-left w-8">
                <div className="w-3 h-3 rounded border border-gray-400 dark:border-gray-500"></div>
              </th>
              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Task Name
                  <ArrowUpDown size={10} />
                </div>
              </th>
              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Project Name
                  <ArrowUpDown size={10} />
                </div>
              </th>
              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Subtasks
                  <ArrowUpDown size={10} />
                </div>
              </th>
              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Status
                  <ArrowUpDown size={10} />
                </div>
              </th>
              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Priority
                  <ArrowUpDown size={10} />
                </div>
              </th>
              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Start Date
                  <ArrowUpDown size={10} />
                </div>
              </th>
              <th className="py-1.5 px-3 text-left font-medium text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  End Date
                  <ArrowUpDown size={10} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-1.5 px-3">
                  <div className="w-3 h-3 rounded border border-gray-400 dark:border-gray-500 cursor-pointer hover:border-[#004e76]"></div>
                </td>
                <td className="py-1.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-200">
                  {task.name}
                </td>
                <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                  {task.project}
                </td>
                <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <FileText size={12} className="text-[#004e76] dark:text-blue-400" />
                    <span>{task.subtasks}</span>
                  </div>
                </td>
                <td className="py-1.5 px-3">
                  <span className={`
                                        px-2 py-0.5 rounded text-[10px] font-semibold text-white inline-block w-20 text-center
                                        ${task.status === 'To-Do' ? 'bg-[#1D4ED8]' : ''}
                                        ${task.status === 'Completed' ? 'bg-[#15803D]' : ''}
                                        ${task.status === 'In Progress' ? 'bg-[#D97706]' : ''}
                                    `}>
                    {task.status}
                  </span>
                </td>
                <td className="py-1.5 px-3">
                  <span className={`
                                        px-2 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1
                                        ${task.priority === 'High' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ''}
                                        ${task.priority === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : ''}
                                        ${task.priority === 'Low' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : ''}
                                    `}>
                    <div className={`
                                            w-1 h-1 rounded-full
                                            ${task.priority === 'High' ? 'bg-red-500' : ''}
                                            ${task.priority === 'Medium' ? 'bg-yellow-500' : ''}
                                            ${task.priority === 'Low' ? 'bg-green-500' : ''}
                                        `}></div>
                    {task.priority}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                  {task.startDate}
                </td>
                <td className="py-1.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                  {task.endDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestTasks;
