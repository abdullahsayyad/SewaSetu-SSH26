"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Complaint } from "@/lib/data/mock-db"
import { getComplaints, resolveComplaint } from "@/app/actions/complaints"
import { FullReportDialog } from "@/components/shared/full-report-dialog"
import { FileText, MapPin, BrainCircuit, CheckSquare } from "lucide-react"

export default function IncomingComplaints() {
    const [department, setDepartment] = useState("Electricity")
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([])
    const [selectedReport, setSelectedReport] = useState<Complaint | null>(null)
    const [isResolving, setIsResolving] = useState<string | null>(null)

    const fetchComplaints = () => {
        getComplaints().then(setAllComplaints)
    }

    useEffect(() => {
        const storedDept = localStorage.getItem("auth_department") || "Electricity"
        setDepartment(storedDept)
        fetchComplaints()
    }, [])

    const handleResolve = async (id: string) => {
        setIsResolving(id)
        const res = await resolveComplaint(id)
        if (res.success) {
            fetchComplaints()
        }
        setIsResolving(null)
    }

    // Show complaints specifically routed to this department
    const complaints = allComplaints.filter(c => c.aiAnalysis.category === department && c.status !== "Resolved")

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#0B3D91] tracking-tight">Intelligence Queue</h2>
                    <p className="text-slate-600 mt-1">AI-processed grievances awaiting departmental action.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {complaints.map(complaint => (
                    <Card key={complaint.id} className="border-slate-200 bg-white relative overflow-hidden group shadow-sm">
                        {complaint.aiAnalysis.riskLevel === "Critical" && (
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#DC2626]"></div>
                        )}
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        ID: {complaint.id}
                                    </span>
                                    <Badge variant={
                                        complaint.aiAnalysis.riskLevel === "Critical" ? "critical" :
                                            complaint.aiAnalysis.riskLevel === "High" ? "high" :
                                                complaint.aiAnalysis.riskLevel === "Moderate" ? "moderate" : "low"
                                    }>
                                        Escalation: {complaint.aiAnalysis.escalationScore}/100
                                    </Badge>
                                </div>
                                <span className="text-sm text-slate-500 font-medium">Recorded: {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-xl font-bold text-[#0B3D91] mb-2">{complaint.aiAnalysis.subCategory}</h4>
                                <div className="flex items-center text-sm text-slate-600 font-medium">
                                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                    {complaint.location.address}
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center mb-2">
                                    <BrainCircuit className="w-4 h-4 text-[#0B3D91] mr-2" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#0B3D91]">AI Extraction Summary</span>
                                </div>
                                <p className="text-sm text-slate-700 italic">"{complaint.aiAnalysis.summary}"</p>
                                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                                    <div className="text-sm text-slate-700">
                                        <span className="font-bold text-slate-900 mr-2">Suggested Action:</span>
                                        {complaint.aiAnalysis.suggestedAction}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 border-t border-slate-100 pt-4">
                                <Button variant="outline" onClick={() => setSelectedReport(complaint)} className="flex-1 border-slate-300 text-slate-700 font-semibold shadow-sm">
                                    <FileText className="w-4 h-4 mr-2" /> View Full Report
                                </Button>
                                <Button
                                    onClick={() => handleResolve(complaint.id)}
                                    disabled={isResolving === complaint.id}
                                    className="bg-[#138808] hover:bg-[#138808]/90 text-white font-semibold"
                                >
                                    {isResolving === complaint.id ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    ) : (
                                        <CheckSquare className="w-4 h-4 mr-2" />
                                    )}
                                    {isResolving === complaint.id ? "Resolving..." : "Resolve Incident"}
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>

            {
                complaints.length === 0 && (
                    <div className="text-center p-16 text-slate-500 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Queue Operational</h3>
                        <p className="mt-2 text-sm">All current grievances have been processed and distributed.</p>
                    </div>
                )
            }

            <FullReportDialog
                complaint={selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </div >
    )
}
