"use client"

import {
  Label,
  PolarRadiusAxis,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

export const description = "A radial chart with text"

const chartData = [
  { browser: "safari", visitors: 63, fill: "#004e76" },
]

export function CompletionChart() {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100/60 p-4 flex flex-col justify-between w-full lg:w-[304px] h-auto min-h-[337px]"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Completion</h3>
        <p className="text-xs text-gray-500">Task completion status</p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="aspect-square h-[180px] w-[180px] relative">
          <RadialBarChart
            width={180}
            height={180}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            data={chartData}
            startAngle={90}
            endAngle={450} // Full circle to match image
            innerRadius={70}
            outerRadius={80}
            barSize={10}
            cx="50%"
            cy="50%"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />
            <RadialBar
              dataKey="visitors"
              background={{ fill: '#e6f3f9' }}
              cornerRadius={10}
              fill="#004e76"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-gray-900 text-3xl font-bold italic"
                        >
                          {chartData[0].visitors.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-gray-500 text-sm"
                        >
                          Completed
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm pt-2">
        <div className="flex items-center justify-between text-gray-500">
          <span className="text-xs">Projects:</span>
          <span className="font-medium text-gray-700 text-xs">670/1050</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span className="text-xs">Completed Tasks:</span>
          <span className="font-medium text-gray-700 text-xs">2774/4192</span>
        </div>
      </div>
    </div>
  )
}
