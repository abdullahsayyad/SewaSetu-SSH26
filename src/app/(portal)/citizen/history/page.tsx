"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Complaint } from "@/lib/data/mock-db"
import { Clock, ExternalLink, Filter } from "lucide-react"
import { TrackingDialog } from "@/components/shared/tracking-dialog"
import { getComplaints } from "@/app/actions/complaints"

export default function ComplaintHistory() {
    const [complaints, setComplaints] = useState<Complaint[]>([])

    // State for the tracking modal
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

    useEffect(() => {
        const cId = localStorage.getItem("citizen_id")
        if (cId) {
            getComplaints(cId).then(setComplaints)
        } else {
            getComplaints().then(setComplaints) // Default fallback if no cookie
        }
    }, [])

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 shadow-sm rounded-lg">
                <div>
                    <h2 className="text-2xl font-bold text-[#0B3D91] tracking-tight">Grievance Ledger</h2>
                    <p className="text-slate-600 mt-1">Track the official status of your submitted petitions.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 text-sm text-slate-600 hover:text-[#0B3D91] bg-slate-50 px-4 py-2 rounded-md border border-slate-300 transition-colors font-medium">
                        <Filter className="w-4 h-4" />
                        <span>Filter Status</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {complaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white border border-slate-200 shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        ID: {complaint.id}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-[#0B3D91]">{complaint.aiAnalysis.category}</h3>
                                <p className="text-slate-600 font-medium text-sm mt-1">{complaint.aiAnalysis.subCategory}</p>
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                                <Badge variant={
                                    complaint.status === "Open" ? "outline" :
                                        complaint.status === "In Progress" ? "secondary" : "low"
                                } className={complaint.status === "Open" ? "bg-slate-100" : ""}>
                                    {complaint.status}
                                </Badge>

                                <div className="text-xs text-slate-500 font-medium">
                                    Risk Assessed: <span className={`font-bold ${complaint.aiAnalysis.riskLevel === 'Critical' ? 'text-red-600' :
                                        complaint.aiAnalysis.riskLevel === 'High' ? 'text-orange-600' :
                                            complaint.aiAnalysis.riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>{complaint.aiAnalysis.riskLevel}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-md p-4 mb-4">
                            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 block">Issue Description</span>
                            <p className="text-sm text-slate-700 italic">"{complaint.description}"</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                            <span className="text-xs text-slate-500 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                Last Updated: {new Date().toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="text-sm text-[#0B3D91] hover:text-[#0B3D91]/80 font-semibold flex items-center transition-colors"
                            >
                                View Official Tracking <ExternalLink className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <TrackingDialog
                complaint={selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
            />
        </div>
    )
}
