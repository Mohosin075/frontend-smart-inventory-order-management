"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
    { name: "RhythmFest", exclusive: 5500, trending: 7200, emerging: 2100 },
    { name: "Sonic Vibes", exclusive: 2800, trending: 2100, emerging: 3900 },
    { name: "Bassline Bash", exclusive: 4200, trending: 2700, emerging: 4100 },
    { name: "Pulse Festival", exclusive: 5400, trending: 6800, emerging: 2000 },
    { name: "Neon Soundwave", exclusive: 5100, trending: 6300, emerging: 2400 },
    { name: "Groove Galaxy", exclusive: 4000, trending: 2300, emerging: 2500 },
    { name: "The Jam Scene", exclusive: 4200, trending: 3100, emerging: 2800 },
];

export function PopularEventsChart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Popular Events</CardTitle>
                <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[linear-gradient(180deg,#906AFF,#F16063)]"></div>

                        <span className="text-sm text-muted-foreground">Exclusive</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF92AE]"></div>
                        <span className="text-sm text-muted-foreground">Trending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[linear-gradient(180deg,#FFC656,#F16063)]"></div>

                        <span className="text-sm text-muted-foreground">Emerging</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                            }}
                            labelStyle={{ color: "var(--foreground)" }}
                        />
                        <defs>
                            <linearGradient id="exclusiveGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#906AFF" />
                                <stop offset="100%" stopColor="#F16063" />
                            </linearGradient>
                        </defs>

                        <Bar dataKey="exclusive" barSize={8} fill="url(#exclusiveGradient)" radius={[4, 4, 0, 0]} />

                        <Bar dataKey="trending" barSize={8} fill="#FF92AE" radius={[4, 4, 0, 0]} />
                        <defs>
                            <linearGradient id="moneyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FFC656" />
                                <stop offset="100%" stopColor="#F16063" />
                            </linearGradient>
                        </defs>

                        <Bar dataKey="emerging" barSize={8} fill="url(#moneyGradient)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
