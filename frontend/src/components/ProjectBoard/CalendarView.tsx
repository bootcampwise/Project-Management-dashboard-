import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import type { CalendarTask } from '../../types';
import { useCalendarView } from '../../hooks/useCalendarView';

const CalendarView: React.FC = () => {
    const {
        viewMode,
        setViewMode,
        currentDate,
        setCurrentDate,
        handleNext,
        handlePrev,
        handleTodayClick,
        handleMonthClick,
        calendarDays,
        weekDays,
        getColorClass
    } = useCalendarView();

    // Mock Tasks matching BoardView data
    const monthTasks: CalendarTask[] = [
        { id: '1', title: 'Contact customers with failed new payents or who churned', date: new Date(2024, 9, 25), color: 'yellow' },
        { id: '2', title: 'Reporting: Design concept of visual dashboard', date: new Date(2024, 9, 25), color: 'blue' },
        { id: '3', title: 'Task detail modal: ideas', date: new Date(2024, 9, 26), color: 'pink' },
        { id: '4', title: '@dev QA: regression ( before/after release)', date: new Date(2024, 8, 2), color: 'gray' },
        { id: '5', title: 'Lead feedback sessions', date: new Date(2024, 8, 22), color: 'green' },
        { id: '6', title: 'Add Projects to templates and layouts [draft 2023]', date: new Date(2024, 9, 28), color: 'green' },
        { id: '7', title: 'Extension: show totals', date: new Date(2024, 9, 28), color: 'green' },
        { id: '8', title: 'Help Docs: update screenshot', date: new Date(2024, 9, 29), color: 'gray' },
        { id: '9', title: 'Help Docs: update screenshot', date: new Date(2024, 7, 6), color: 'gray' },
        { id: '10', title: 'Invoices: fixed-fee projects', date: new Date(2024, 9, 30), color: 'blue' },
        { id: '11', title: 'Time: search - not last response with results appears', date: new Date(2024, 8, 8), color: 'pink' },
        { id: '12', title: 'Pricing page: new iteration and few mockups and ideas', date: new Date(2024, 10, 4), color: 'blue' },
        { id: '13', title: '@dev QA: regression ( before/after release)', date: new Date(2024, 10, 3), color: 'gray' },
    ];

    return (
        <div className="flex flex-col h-full bg-white font-sans text-sm">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                        {viewMode === 'month' ? format(currentDate, 'MMMM yyyy') : format(currentDate, 'd MMMM yyyy')}
                        {viewMode === 'month' && <ChevronDown size={14} className="text-gray-400" />}
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle (Always Visible) */}
                    <div className="flex items-center bg-white rounded border border-gray-200 p-0.5 shadow-sm">
                        <button
                            onClick={handleMonthClick}
                            className={`px-3 py-1 text-xs font-medium rounded shadow-sm ${viewMode === 'month' ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'text-gray-500 hover:text-gray-700 border border-transparent'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={handleTodayClick}
                            className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'day' ? 'bg-gray-50 text-gray-600 border border-gray-200 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'}`}
                        >
                            Today
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-1 text-gray-400">
                        <button onClick={handlePrev} className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={handleNext} className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Switcher */}
            {viewMode === 'month' ? (
                // Month Grid
                <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Cells */}
                    <div className="grid grid-cols-7 gap-y-12">
                        {calendarDays.map((day) => {
                            const dayTasks = monthTasks.filter(t => t.date !== undefined && isSameDay(t.date, day));
                            // Force highlight on Nov 13 2024 to match image (or current date interactively)
                            // If user clicks "Today", we might want to highlight THAT date.
                            // But let's keep the mock highlight for the "Image Match" requirement on the Month view.
                            const isTodayMock = day.getDate() === 13 && day.getMonth() === 10 && day.getFullYear() === 2024;

                            return (
                                <div
                                    key={day.toISOString()}
                                    onClick={() => { setCurrentDate(day); setViewMode('day'); }}
                                    className="min-h-[100px] relative px-1 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                                >
                                    {/* Date Number */}
                                    <div className={`text-[11px] text-right mb-2 pr-2 ${isTodayMock ? '' : 'text-gray-500'}`}>
                                        {isTodayMock ? (
                                            <span className="bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full ml-auto">
                                                {format(day, 'd')}
                                            </span>
                                        ) : (
                                            format(day, 'd')
                                        )}
                                    </div>

                                    {/* Tasks */}
                                    <div className="flex flex-col gap-1">
                                        {dayTasks.map(task => (
                                            <div
                                                key={task.id}
                                                className={`text-[10px] px-2 py-1.5 rounded-md truncate font-medium flex items-center ${getColorClass(task.color)} shadow-sm`}
                                                title={task.title}
                                            >
                                                <span className="truncate">{task.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                // Day View (Simple List - "Not Timeline")
                <div className="flex-1 p-8 overflow-y-auto bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        Tasks for {format(currentDate, 'MMMM d, yyyy')}
                    </h3>

                    {monthTasks.filter(t => t.date !== undefined && isSameDay(t.date, currentDate)).length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>No tasks scheduled for this day.</p>
                            <button className="mt-4 text-blue-600 hover:underline text-sm">Add a task</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-w-2xl">
                            {monthTasks.filter(t => t.date !== undefined && isSameDay(t.date, currentDate)).map(task => (
                                <div key={task.id} className={`p-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between ${getColorClass(task.color).replace('border-l-[3px]', 'border-l-4')}`}>
                                    <div className="flex items-center gap-4">
                                        {/* Checkbox circle mock */}
                                        <div className="w-5 h-5 rounded-full border-2 border-current opacity-40"></div>
                                        <span className="font-medium text-base">{task.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs opacity-70 font-medium px-2 py-1 bg-white/50 rounded">10:00 AM</span>
                                        <div className="w-6 h-6 rounded-full bg-gray-200 border border-white"></div> {/* Avatar mock */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default CalendarView;
