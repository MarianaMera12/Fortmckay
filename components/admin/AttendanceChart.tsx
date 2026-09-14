"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AttendanceChart({
  data,
}: {
  data: { hour: string; visits: number }[];
}) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid vertical={false} stroke="#00000010" />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6e6f72" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#8b8c8f" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #00000010", fontSize: 13 }}
          />
          <Bar dataKey="visits" fill="#b39264" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
