"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const data = [
    { name: "", value: 20 },
    { name: "", value: 40 },
    { name: "", value: 35 },
    { name: "", value: 50 },
    { name: "", value: 25 },
    { name: "", value: 45 },
    { name: "", value: 20 },
    { name: "", value: 30 },
    { name: "", value: 55 },
    { name: "", value: 60 },
    { name: "", value: 20 },
    { name: "", value: 15 },
    { name: "", value: 80 },
    { name: "", value: 30 },
    { name: "", value: 20 },
    { name: "", value: 65 },
];

const phases = [
    { title: "Menstrual", range: "Days 1-5" },
    { title: "Follicular", range: "Days 6-12" },
    { title: "Ovulatory", range: "Days 13-16" },
    { title: "Luteal", range: "Days 17-28" },
];

export default function PhaseEngagementTrend({ data: chartData }: { data?: any[] }) {
    const defaultData = [
        { label: "Week 1", menstrual: 20, follicular: 40, ovulatory: 35, luteal: 50 },
        { label: "Week 2", menstrual: 25, follicular: 45, ovulatory: 20, luteal: 30 },
        { label: "Week 3", menstrual: 55, follicular: 60, ovulatory: 20, luteal: 15 },
        { label: "Week 4", menstrual: 80, follicular: 30, ovulatory: 20, luteal: 65 },
    ];

    const displayData = chartData || defaultData;

    return (
        <div className="w-full h-[300px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                    <defs>
                        <linearGradient id="colorMenstrual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F48FB1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#F48FB1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFollicular" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E0F2FE" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#E0F2FE" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOvulatory" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D1FAE5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D1FAE5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorLuteal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FEF3C7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FEF3C7" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="label" hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="menstrual" stroke="#F48FB1" strokeWidth={2} fillOpacity={1} fill="url(#colorMenstrual)" />
                    <Area type="monotone" dataKey="follicular" stroke="#0EA5E9" strokeWidth={2} fillOpacity={1} fill="url(#colorFollicular)" />
                    <Area type="monotone" dataKey="ovulatory" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorOvulatory)" />
                    <Area type="monotone" dataKey="luteal" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorLuteal)" />
                </AreaChart>
            </ResponsiveContainer>
            <div className="mt-6 px-12 border-t border-[#FDE8ED] pt-3 pb-4">
                <div className="flex justify-between text-[#F48FB1] font-serif">
                    {phases.map((phase) => (
                        <div key={phase.title} className="w-1/4 text-center">
                            <div className="text-xs font-bold uppercase tracking-[0.18em]">
                                {phase.title}
                            </div>
                            <div className="mt-1 text-[11px]">
                                {phase.range}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
