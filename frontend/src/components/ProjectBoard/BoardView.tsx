import React from 'react';
import { Plus } from 'lucide-react';
import BoardColumn from './BoardColumn';
import type { Task } from '../../types';

interface BoardViewProps {
    onTaskClick?: (task: Task) => void;
    onAddTask?: (status: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ onTaskClick, onAddTask }) => {
    // Mock Data
    interface Column {
        id: string;
        title: string;
        count: number;
        color: string;
        tasks: Task[];
        collapsed?: boolean;
    }

    const columns: Column[] = [
        {
            id: 'backlog',
            title: 'Backlog',
            count: 4,
            color: 'bg-gray-400',
            tasks: [
                {
                    id: '1',
                    name: 'Contact customers with failed new payents or who churned',
                    title: 'Contact customers with failed new payents or who churned',
                    project: 'Customer Success',
                    subtasks: 0,
                    status: 'To-Do',
                    priority: 'High',
                    startDate: '2024-08-01',
                    endDate: '2024-08-06',
                    tags: [{ text: 'design', color: 'text-blue-600', bg: 'bg-blue-50' }, { text: 'design', color: 'text-green-600', bg: 'bg-green-50' }],
                    assignee: { name: 'Hanry', avatar: 'https://i.pravatar.cc/150?u=1' },
                    comments: 2,
                    attachments: 5,
                    date: 'Aug 6'
                },
                {
                    id: '2',
                    name: 'Reporting: Design concept of visual dashboard',
                    title: 'Reporting: Design concept of visual dashboard',
                    project: 'Analytics',
                    subtasks: 0,
                    status: 'To-Do',
                    priority: 'Medium',
                    startDate: '2024-08-01',
                    endDate: '2024-08-15',
                    tags: [{ text: 'bug', color: 'text-red-600', bg: 'bg-red-50' }, { text: 'API', color: 'text-orange-600', bg: 'bg-orange-50' }],
                    assignee: { name: 'Hanna', avatar: 'https://i.pravatar.cc/150?u=2' },
                    comments: 0,
                    attachments: 0,
                    date: ''
                },
                {
                    id: '3',
                    name: 'Task detail modal: ideas',
                    title: 'Task detail modal: ideas',
                    project: 'UI/UX',
                    subtasks: 0,
                    status: 'To-Do',
                    priority: 'Low',
                    startDate: '2024-08-05',
                    endDate: '2024-09-10',
                    tags: [],
                    assignee: { name: 'Hanry', avatar: 'https://i.pravatar.cc/150?u=1' },
                    comments: 0,
                    attachments: 0,
                    date: ''
                },
                {
                    id: '4',
                    name: '@dev QA: regression ( before/after release)',
                    title: '@dev QA: regression ( before/after release)',
                    project: 'QA Testing',
                    subtasks: 0,
                    status: 'To-Do',
                    priority: 'High',
                    startDate: '2024-08-28',
                    endDate: '2024-09-02',
                    tags: [{ text: 'bud', color: 'text-red-600', bg: 'bg-red-50' }, { text: 'design', color: 'text-green-600', bg: 'bg-green-50' }],
                    assignee: { name: 'Hanry', avatar: 'https://i.pravatar.cc/150?u=1' },
                    comments: 0,
                    attachments: 0,
                    date: 'Sep 2'
                }
            ]
        },
        {
            id: 'postpone',
            title: 'Postpone',
            count: 6,
            color: 'bg-red-400',
            tasks: [],
            collapsed: true
        },
        {
            id: 'inprogress',
            title: 'In progress',
            count: 5,
            color: 'bg-green-400',
            tasks: [
                {
                    id: '5',
                    name: 'Lead feedback sessions',
                    title: 'Lead feedback sessions',
                    project: 'Product',
                    subtasks: 0,
                    status: 'In Progress',
                    priority: 'Medium',
                    startDate: '2024-09-15',
                    endDate: '2024-09-22',
                    tags: [{ text: 'design', color: 'text-blue-600', bg: 'bg-blue-50' }, { text: 'design', color: 'text-green-600', bg: 'bg-green-50' }],
                    assignee: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=3' },
                    comments: 1,
                    attachments: 0,
                    date: 'Sep 22'
                },
                {
                    id: '6',
                    name: 'Add Projects to templates and layouts [draft 2023]',
                    title: 'Add Projects to templates and layouts [draft 2023]',
                    project: 'Templates',
                    subtasks: 0,
                    status: 'In Progress',
                    priority: 'Low',
                    startDate: '2024-09-01',
                    endDate: '2024-09-30',
                    tags: [],
                    assignee: { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=4' },
                    comments: 0,
                    attachments: 0,
                    date: ''
                },
                {
                    id: '7',
                    name: 'Extension: show totals',
                    title: 'Extension: show totals',
                    project: 'Extensions',
                    subtasks: 0,
                    status: 'In Progress',
                    priority: 'Medium',
                    startDate: '2024-09-10',
                    endDate: '2024-09-25',
                    tags: [],
                    assignee: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=5' },
                    comments: 2,
                    attachments: 0,
                    date: ''
                },
                {
                    id: '8',
                    name: 'Help Docs: update screenshot',
                    title: 'Help Docs: update screenshot',
                    project: 'Documentation',
                    subtasks: 0,
                    status: 'In Progress',
                    priority: 'Low',
                    startDate: '2024-09-01',
                    endDate: '2024-09-15',
                    tags: [{ text: 'plan', color: 'text-orange-600', bg: 'bg-orange-50' }, { text: 'bug', color: 'text-red-600', bg: 'bg-red-50' }],
                    assignee: { name: 'Billy', avatar: '' },
                    comments: 0,
                    attachments: 0,
                    date: ''
                },
                {
                    id: '9',
                    name: 'Help Docs: update screenshot',
                    title: 'Help Docs: update screenshot',
                    project: 'Documentation',
                    subtasks: 0,
                    status: 'In Progress',
                    priority: 'Low',
                    startDate: '2024-07-30',
                    endDate: '2024-08-06',
                    tags: [],
                    assignee: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=5' },
                    comments: 2,
                    attachments: 0,
                    date: 'Aug 6'
                }
            ]
        },
        {
            id: 'qa',
            title: 'QA',
            count: 4,
            color: 'bg-orange-400',
            tasks: [
                {
                    id: '10',
                    name: 'Invoices: fixed-fee projects',
                    title: 'Invoices: fixed-fee projects',
                    project: 'Finance',
                    subtasks: 0,
                    status: 'Completed',
                    priority: 'High',
                    startDate: '2024-09-01',
                    endDate: '2024-09-15',
                    tags: [{ text: 'design', color: 'text-blue-600', bg: 'bg-blue-50' }, { text: 'design', color: 'text-green-600', bg: 'bg-green-50' }],
                    assignee: { name: 'Adam', avatar: '' },
                    comments: 2,
                    attachments: 5,
                    date: ''
                },
                {
                    id: '11',
                    name: 'Time: search - not last response with results appears',
                    title: 'Time: search - not last response with results appears',
                    project: 'Bug Fixes',
                    subtasks: 0,
                    status: 'Completed',
                    priority: 'High',
                    startDate: '2024-09-01',
                    endDate: '2024-09-08',
                    tags: [{ text: 'bug', color: 'text-red-600', bg: 'bg-red-50' }],
                    assignee: { name: 'Henry', avatar: 'https://i.pravatar.cc/150?u=6' },
                    comments: 5,
                    attachments: 0,
                    date: 'Sep 8'
                },
                {
                    id: '12',
                    name: 'Pricing page: new iteration and few mockups and ideas',
                    title: 'Pricing page: new iteration and few mockups and ideas',
                    project: 'Marketing',
                    subtasks: 0,
                    status: 'Completed',
                    priority: 'Medium',
                    startDate: '2024-09-05',
                    endDate: '2024-09-20',
                    tags: [],
                    assignee: { name: 'Fiona', avatar: 'https://i.pravatar.cc/150?u=7' },
                    comments: 0,
                    attachments: 0,
                    date: ''
                },
                {
                    id: '13',
                    name: '@dev QA: regression ( before/after release)',
                    title: '@dev QA: regression ( before/after release)',
                    project: 'QA Testing',
                    subtasks: 0,
                    status: 'Completed',
                    priority: 'High',
                    startDate: '2024-10-28',
                    endDate: '2024-11-03',
                    tags: [],
                    assignee: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=3' },
                    comments: 0,
                    attachments: 0,
                    date: 'Nov 3'
                }
            ]
        },
    ];

    return (
        <div className="flex h-full w-full gap-4 pb-4 overflow-hidden">
            {columns.map((column) => (
                <BoardColumn
                    key={column.id}
                    title={column.title}
                    count={column.count}
                    color={column.color}
                    tasks={column.tasks}
                    collapsed={column.collapsed}
                    onTaskClick={onTaskClick}
                    onAddTask={onAddTask}
                />
            ))}

            {/* Add Section - Rendered as a simple header button area instead of full column to save space and match image style roughly */}
            <div className="w-[120px] pt-1">
                <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium whitespace-nowrap">
                    <Plus size={16} />
                    <span>Add section</span>
                </button>
            </div>
        </div>
    );
};

export default BoardView;
