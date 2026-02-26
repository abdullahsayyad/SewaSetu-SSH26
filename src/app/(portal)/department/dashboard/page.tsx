"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { MetricCard } from "@/components/shared/metric-card"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { AlertOctagon, CheckSquare, Clock, Users } from "lucide-react"

// Chart data processing - Mocked for the specific department
const resolutionData = [
    { name: "Mon", incoming: 45, resolved: 32 },
    { name: "Tue", incoming: 52, resolved: 48 },
    { name: "Wed", incoming: 38, resolved: 41 },
    { name: "Thu", incoming: 65, resolved: 50 },
    { name: "Fri", incoming: 48, resolved: 55 },
    { name: "Sat", incoming: 25, resolved: 30 },
    { name: "Sun", incoming: 20, resolved: 15 },
]

const categoryDistribution = [
    { name: "Power Outage", value: 45 },
    { name: "Streetlights", value: 30 },
    { name: "Billing Issues", value: 15 },
    { name: "Fallen Wires", value: 10 },
]

const COLORS = ["#0B3D91", "#138808", "#FF9933", "#475569"] // Gov of India palette

export default function DepartmentDashboard() {
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        getComplaints().then(setAllComplaints)
    }, [])

    // Filter mock DB for this specific department
    const deptComplaints = allComplaints.filter(c => c.aiAnalysis.category === department)

    const activeCases = deptComplaints.filter(c => c.status !== "Resolved").length
    const criticalAlerts = deptComplaints.filter(c => c.aiAnalysis.riskLevel === "Critical" && c.status !== "Resolved").length

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#0B3D91] tracking-tight">{department} Department Operations</h2>
                    <p className="text-slate-600 mt-1">Live administrative dashboard for resource allocation and SLA monitoring.</p>
                </div>
            </div>

            {criticalAlerts > 0 && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded shadow-sm mb-6 flex items-start">
                    <AlertOctagon className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
                    <div>
                        <h4 className="text-red-800 font-bold">Action Required: {criticalAlerts} Critical SLA Breach Warnings</h4>
                        <p className="text-red-700 text-sm mt-1">Emergency dispatch teams must be allocated to High-Risk issues immediately to avoid penalty points.</p>
                    </div>
                </div>
            )}

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Active Cases"
                    value={activeCases}
                    icon={Users}
                    trend="up"
                    trendValue="5%"
                />
                <MetricCard
                    title="Critical Alerts"
                    value={criticalAlerts}
                    icon={AlertOctagon}
                    critical={criticalAlerts > 0}
                />
                <MetricCard
                    title="SLA Breaches"
                    value="2"
                    icon={Clock}
                    critical={true}
                />
                <MetricCard
                    title="Resolution Velocity"
                    value="82%"
                    icon={CheckSquare}
                    trend="up"
                    trendValue="12%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {/* Resolution vs Incoming Chart */}
                <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
                    <h3 className="text-lg font-bold text-[#0B3D91] mb-6">Case Velocity (7 Days)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={resolutionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", color: "#111827" }}
                                    itemStyle={{ color: "#111827" }}
                                />
                                <Bar dataKey="incoming" name="Reported" fill="#0B3D91" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="resolved" name="Resolved" fill="#138808" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
                    <h3 className="text-lg font-bold text-[#0B3D91] mb-6">Issue Distrubution Analytics</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                                    itemStyle={{ color: "#111827" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center flex-wrap gap-4 mt-2">
                        {categoryDistribution.map((category, idx) => (
                            <div key={category.name} className="flex items-center text-xs text-slate-600 font-medium">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx] }}></div>
                                {category.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
