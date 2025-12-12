import React from 'react';

const TimelineView: React.FC = () => {
    // Shared Data Structure for the Demo
    const dayHours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    return (
        <div className="bg-white rounded-lg border border-gray-200 font-sans text-sm h-full flex flex-col p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-700">Timeline</h3>
                <span className="text-sm text-gray-500">October 12, 2024</span>
            </div>

            {/* Timeline Content */}
            <div className="flex-1">
                {/* Time Header */}
                <div className="flex bg-gray-100 rounded-lg py-2 mb-6">
                    {dayHours.map(hour => (
                        <div key={hour} className="flex-1 text-center text-xs font-medium text-gray-600 border-r border-gray-200 last:border-0">
                            {hour}
                        </div>
                    ))}
                </div>


                {/* Timeline Rows */}
                <div className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-10 gap-3">
                        {/* Contact customers - starts at 8:00 */}
                        <div className="col-start-1 col-span-2 bg-orange-50 border-l-[3px] border-orange-400 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Contact customers with failed new payents</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                        {/* Dashboard concept - starts at 10:00 */}
                        <div className="col-start-3 col-span-2 bg-emerald-50 border-l-[3px] border-emerald-400 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Dashboard: concept</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                        {/* Extension show totals - starts at 14:00 */}
                        <div className="col-start-7 col-span-3 bg-cyan-50 border-l-[3px] border-cyan-400 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Extension: show totals</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-10 gap-3">
                        {/* Task detail modal - starts at 9:00 */}
                        <div className="col-start-2 col-span-2 bg-rose-50 border-l-[3px] border-rose-300 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Task detail modal</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                        {/* Help Docs - starts at 14:00 */}
                        <div className="col-start-7 col-span-2 bg-gray-100 border-l-[3px] border-gray-400 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Help Docs: update screenshot</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-10 gap-3">
                        {/* Reporting - wide block starts at 8:00 */}
                        <div className="col-start-1 col-span-6 bg-blue-50 border-l-[3px] border-blue-400 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Reporting: Design concept of visual dashboard</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-10 gap-3">
                        {/* Contact customers (second) - starts at 8:00 */}
                        <div className="col-start-1 col-span-2 bg-orange-50 border-l-[3px] border-orange-400 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Contact customers with failed new payents</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                        {/* Task detail modal (second) - starts at 10:00 */}
                        <div className="col-start-3 col-span-2 bg-rose-50 border-l-[3px] border-rose-300 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Task detail modal</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                        {/* Extension show totals (second) - starts at 14:00 */}
                        <div className="col-start-7 col-span-3 bg-cyan-50 border-l-[3px] border-cyan-400 rounded-md p-2 shadow-sm">
                            <h4 className="font-medium text-gray-700 text-[11px] leading-tight mb-0.5 truncate">Extension: show totals</h4>
                            <span className="text-[10px] text-gray-400">10:00-12:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
