"use client"

import { ArrowUpRight } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const chartData = [
    { day: "01", budget: 500000, expenses: 200000 },
    { day: "02", budget: 600000, expenses: 300000 },
    { day: "03", budget: 550000, expenses: 280000 },
    { day: "04", budget: 700000, expenses: 400000 },
    { day: "05", budget: 900000, expenses: 550000 },
    { day: "06", budget: 1200000, expenses: 800000 },
    { day: "07", budget: 1500000, expenses: 1100000 },
    { day: "08", budget: 1800000, expenses: 1400000 },
    { day: "09", budget: 2000000, expenses: 1600000 },
    { day: "10", budget: 2200000, expenses: 1800000 },
    { day: "11", budget: 2500000, expenses: 2100000 },
    { day: "12", budget: 2800000, expenses: 2400000 },
    { day: "13", budget: 2600000, expenses: 2200000 },
    { day: "14", budget: 2400000, expenses: 2000000 },
    { day: "15", budget: 3000000, expenses: 2500000 }, // Peak
    { day: "16", budget: 3200000, expenses: 2700000 },
    { day: "17", budget: 2800000, expenses: 2300000 },
    { day: "18", budget: 2500000, expenses: 2000000 },
    { day: "19", budget: 2200000, expenses: 1800000 },
    { day: "20", budget: 2600000, expenses: 2100000 },
    { day: "21", budget: 2900000, expenses: 2400000 },
    { day: "22", budget: 3100000, expenses: 2600000 },
    { day: "23", budget: 3300000, expenses: 2800000 },
    { day: "24", budget: 3500000, expenses: 3000000 },
    { day: "25", budget: 3400000, expenses: 3100000 },
    { day: "26", budget: 3600000, expenses: 3300000 },
    { day: "27", budget: 3500000, expenses: 3200000 },
    { day: "28", budget: 3700000, expenses: 3400000 },
    { day: "29", budget: 3800000, expenses: 3500000 },
    { day: "30", budget: 3900000, expenses: 3600000 },
]

interface TooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string }>;
    label?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#93C5FD]"></div>
                    <span className="text-gray-600 font-medium">567k</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#004e76]"></div>
                    <span className="text-gray-600 font-medium">103k</span>
                </div>
                <div className="text-gray-400 text-xs text-center border-t border-gray-100 pt-2 mt-1">
                    Aug 15,2025
                </div>
            </div>
        )
    }
    return null
}

export function BudgetChart() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100/60 p-4 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Budget and Expenses</h3>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-sm text-green-600 font-medium">
                    <ArrowUpRight size={16} />
                    <span>54.7%</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#004e76" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#004e76" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 30" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            ticks={[0, 50000, 100000, 500000, 1000000, 5000000]}
                            tickFormatter={(value) => {
                                if (value === 0) return '0';
                                if (value >= 1000000) return `${value / 1000000}M`;
                                if (value >= 1000) return `${value / 1000}k`;
                                return value;
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="budget"
                            stroke="#93C5FD"
                            fillOpacity={1}
                            fill="url(#colorBudget)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            stroke="#004e76"
                            fillOpacity={1}
                            fill="url(#colorExpenses)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#93C5FD]" />
                    <span className="text-sm text-gray-500">Budget</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#004e76]" />
                    <span className="text-sm text-gray-500">Expenses</span>
                </div>
            </div>
        </div>
    )
}
