import React from "react";
import Sidebar from "../sidebar/Sidebar";
import StatsGrid from "../../components/dashboard/StatsGrid";
import { CompletionChart } from "../../components/dashboard/CompletionChart";
import ScheduleCalendar from "../../components/dashboard/ScheduleCalendar";
import { BudgetChart } from "../../components/dashboard/BudgetChart";
import LatestTasks from "../../components/dashboard/LatestTasks";
import {
  Menu,
  ChevronDown,
  SlidersHorizontal,
  Calendar
} from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import { dashboardClasses } from "./dashboardStyle";

const Dashboard: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useDashboard();

  return (
    <div className={dashboardClasses.container}>

      {/* Mobile menu button (and Desktop re-open button) */}
      <button
        className={dashboardClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className={dashboardClasses.main}>
        <div className={dashboardClasses.mainContent(sidebarOpen)}>

          {/* Page Header */}
          <div className={dashboardClasses.header}>
            <h1 className={dashboardClasses.title}>Dashboard</h1>
          </div>

          {/* Toolbar */}
          <div className={dashboardClasses.toolbar}>
            {/* Left: Filters */}
            <div className={dashboardClasses.filtersWrapper}>
              {/* All Projects Dropdown */}
              <div className={dashboardClasses.projectsDropdown}>
                <span className={dashboardClasses.dropdownText}>All Projects</span>
                <ChevronDown size={16} />
              </div>

              {/* Filters Button */}
              <div className={dashboardClasses.filtersButton}>
                <SlidersHorizontal size={16} />
                <span className={dashboardClasses.filtersButtonText}>Filters</span>
              </div>
            </div>

            {/* Right: Date & Time Range */}
            <div className={dashboardClasses.rangeWrapper}>
              {/* Date Display */}
              <div className={dashboardClasses.dateDisplay}>
                <Calendar size={16} />
                <span className={dashboardClasses.dateText}>Aug 3, 2025</span>
              </div>

              {/* Range Selector */}
              <div className={dashboardClasses.rangeSelector}>
                {['D', 'W', 'M', '6M', 'Y'].map((range) => (
                  <button
                    key={range}
                    className={dashboardClasses.rangeButton(range === 'M')}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={dashboardClasses.contentSection}>
            {/* Stats Grid */}
            <div className={dashboardClasses.statsGridWrapper}>
              <StatsGrid />
            </div>

            {/* Charts Section */}
            <div className={dashboardClasses.chartsSection}>
              {/* Completion Chart */}
              <div className={dashboardClasses.completionChartWrapper}>
                <CompletionChart />
              </div>

              {/* Schedule Calendar */}
              <div className={dashboardClasses.scheduleCalendarWrapper}>
                <ScheduleCalendar />
              </div>

              {/* Budget Chart */}
              <div className={dashboardClasses.budgetChartWrapper}>
                <BudgetChart />
              </div>
            </div>

            {/* Latest Tasks Section */}
            <div className={dashboardClasses.latestTasksWrapper}>
              <LatestTasks />
            </div>
          </div>
        </div >
      </main >
    </div >
  );
};

export default Dashboard;
