"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MetricCard } from "@/components/shared/metric-card"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints } from "@/app/actions/complaints"
import { FileIcon, AlertTriangle, CheckSquare, Clock } from "lucide-react"

// Dynamically import the map so it only loads client-side
const CivicMap = dynamic(() => import("@/components/shared/civic-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">
            <div className="text-slate-500 font-medium">Initializing Locality Map...</div>
        </div>
    )
})

export default function CitizenDashboard() {
    const [complaints, setComplaints] = useState<Complaint[]>([])

    useEffect(() => {
        const cId = localStorage.getItem("citizen_id")
        if (cId) {
            getComplaints(cId).then(setComplaints)
        } else {
            getComplaints().then(setComplaints) // Default fallback if no cookie
        }
    }, [])

    const activeIssues = complaints.filter(c => c.status !== "Resolved").length
    const criticalIssues = complaints.filter(c => c.aiAnalysis.riskLevel === "Critical" && c.status !== "Resolved").length
    const resolvedIssues = complaints.filter(c => c.status === "Resolved").length

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-[#0B3D91] tracking-tight">Citizen Dashboard</h2>
                <p className="text-slate-600 mt-1">Overview of civic grievances in your registered locality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Active Grievances"
                    value={activeIssues}
                    icon={FileIcon}
                    trend="up"
                    trendValue="12%"
                    description="vs last month"
                />
                <MetricCard
                    title="Critical Alerts"
                    value={criticalIssues}
                    icon={AlertTriangle}
                    critical={true}
                    description="Immediate action pending"
                />
                <MetricCard
                    title="Resolved Cases"
                    value={resolvedIssues}
                    icon={CheckSquare}
                    trend="up"
                    trendValue="24%"
                    description="Closure rate improving"
                />
                <MetricCard
                    title="Avg. Resolution"
                    value="48h"
                    icon={Clock}
                    trend="down"
                    trendValue="5h"
                    description="Faster than SLA"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-lg font-bold text-[#0B3D91]">Locality Incident Map</h3>
                            <p className="text-sm text-slate-500">Real-time geographical distribution of reported issues.</p>
                        </div>
                    </div>
                    {/* Wrap map in a container that forces a re-render if needed, but dynamic import handles it */}
                    <div className="w-full bg-white p-2 border border-slate-200 shadow-sm rounded-lg">
                        <CivicMap complaints={complaints} height="500px" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#0B3D91]">Recent Dockets</h3>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                        {complaints.slice(0, 4).map((complaint) => (
                            <div key={complaint.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-mono text-slate-500 font-medium">{complaint.id}</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <p className="font-medium text-[#0B3D91] text-sm mb-1">{complaint.aiAnalysis.subCategory}</p>
                                <p className="text-xs text-slate-600 truncate">{complaint.location.address}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 text-sm font-semibold text-[#0B3D91] bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors">
                        View All Grievances
                    </button>
                </div>
            </div>
        </div>
    )
}
