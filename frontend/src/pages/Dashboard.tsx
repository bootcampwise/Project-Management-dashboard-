import React from "react";
import Sidebar from "../components/Sidebar/index";
import StatsGrid from "../components/dashboard/StatsGrid";
import { CompletionChart } from "../components/dashboard/CompletionChart";
import ScheduleCalendar from "../components/dashboard/ScheduleCalendar";
import { BudgetChart } from "../components/dashboard/BudgetChart";
import LatestTasks from "../components/dashboard/LatestTasks";
import {
    Menu,
    ChevronDown,
    SlidersHorizontal,
    Calendar
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
const Dashboard: React.FC = () => {
    const { sidebarOpen, setSidebarOpen } = useDashboard();

    return (
        <div className="flex h-screen bg-white relative font-sans">

            {/* Mobile menu button (and Desktop re-open button) */}
            <button
                className={`absolute top-4 left-4 z-30 p-2 bg-white rounded-md shadow ${sidebarOpen ? 'md:hidden' : 'block'}`}
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={22} />
            </button>

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-white">
                <div className={`transition-all duration-300 flex-1 flex flex-col ${!sidebarOpen ? 'pt-16 md:pt-0 md:pl-16' : ''}`}>

                    {/* Page Header */}
                    <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    </div>

                    {/* Toolbar */}
                    <div className="px-6 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left: Filters */}
                        <div className="flex items-center gap-6">
                            {/* All Projects Dropdown */}
                            <div className="flex items-center gap-2 text-gray-500 cursor-pointer">
                                <span className="text-sm">All Projects</span>
                                <ChevronDown size={16} />
                            </div>

                            {/* Filters Button */}
                            <div className="flex items-center gap-2 text-gray-500 cursor-pointer border-l pl-6 border-gray-200">
                                <SlidersHorizontal size={16} />
                                <span className="text-sm">Filters</span>
                            </div>
                        </div>

                        {/* Right: Date & Time Range */}
                        <div className="flex items-center gap-6">
                            {/* Date Display */}
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar size={16} />
                                <span className="text-sm">Aug 3, 2025</span>
                            </div>

                            {/* Range Selector */}
                            <div className="flex items-center bg-gray-100 rounded-md p-0.5">
                                {['D', 'W', 'M', '6M', 'Y'].map((range) => (
                                    <button
                                        key={range}
                                        className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${range === 'M'
                                            ? 'bg-white shadow-sm text-gray-800'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        {/* Stats Grid */}
                        <div className="mb-8">
                            <StatsGrid />
                        </div>

                        {/* Charts Section */}
                        <div className="flex flex-wrap gap-3">
                            {/* Completion Chart */}
                            <div>
                                <CompletionChart />
                            </div>

                            {/* Schedule Calendar */}
                            <div>
                                <ScheduleCalendar />
                            </div>

                            {/* Budget Chart */}
                            <div className="flex-1 min-w-[300px]">
                                <BudgetChart />
                            </div>
                        </div>

                        {/* Latest Tasks Section */}
                        <div className="mt-6">
                            <LatestTasks />
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
};

export default Dashboard;
