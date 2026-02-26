"use server"

import { db } from "@/lib/db"
import { Complaint, ComplaintStatus } from "@/lib/data/mock-db"
import { revalidatePath } from "next/cache"

const statusMapping: Record<string, ComplaintStatus> = {
    'pending': 'Open',
    'in_progress': 'In Progress',
    'escalated': 'In Progress',
    'resolved': 'Resolved'
}

export async function getComplaints(citizenId?: string): Promise<Complaint[]> {
    try {
        const complaints = await db.complaints.findMany({
            where: citizenId ? { citizen_id: citizenId } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                complaint_ai_analysis: true,
                departments: true,
                attachments: true
            }
        })

        return complaints.map((c: any) => {
            const ai = c.complaint_ai_analysis[0]
            const photoUrl = c.attachments?.[0]?.file_url || null

            return {
                id: c.id.slice(-8).toUpperCase(), // Short visual ID for UI
                citizenId: c.citizen_id,
                description: c.description,
                location: {
                    lat: Number(c.latitude),
                    lng: Number(c.longitude),
                    address: "Mapped Location"
                },
                photoUrl,
                createdAt: c.created_at?.toISOString() || new Date().toISOString(),
                status: statusMapping[c.status] || 'Open',
                aiAnalysis: ai ? {
                    category: ai.category,
                    subCategory: ai.sub_category || "",
                    riskLevel: ai.risk_score > 80 ? "Critical" : ai.risk_score > 50 ? "High" : "Low",
                    escalationScore: ai.escalation_score,
                    sentimentScore: Number(ai.sentiment_score),
                    keywords: ai.extracted_keywords as string[] | undefined,
                    summary: ai.ai_summary,
                    suggestedAction: ai.suggested_action || undefined,
                    estimatedResolutionHours: c.departments?.sla_hours || 48
                } : {
                    category: "Unknown",
                    subCategory: "Unknown",
                    riskLevel: "Low",
                    escalationScore: 0,
                    sentimentScore: 0,
                    summary: "No AI data",
                    estimatedResolutionHours: 48
                }
            }
        }) as Complaint[]

    } catch (error) {
        console.error("Failed to fetch complaints from DB", error)
        return []
    }
}

export async function logComplaint(data: any, citizenId?: string) {
    try {
        let citizen;

        if (citizenId) {
            citizen = await db.users.findUnique({ where: { id: citizenId } })
        }

        // Fallback to random if unauthenticated (shouldn't happen in normal flow now)
        if (!citizen) {
            citizen = await db.users.findFirst({ where: { role: 'citizen' } })
        }

        let department = await db.departments.findFirst({
            where: { name: { contains: data.aiAnalysis.category, mode: 'insensitive' } }
        })

        if (!department) {
            department = await db.departments.findFirst() // Fallback
        }

        if (!citizen || !department) {
            throw new Error("Missing default users or departments in Seed DB")
        }

        const newComplaint = await db.complaints.create({
            data: {
                citizen_id: citizen.id,
                department_id: department.id,
                title: data.aiAnalysis.summary.substring(0, 50),
                description: data.description,
                latitude: data.location.lat,
                longitude: data.location.lng,
                priority_level: data.aiAnalysis.riskLevel === 'Critical' ? 'critical' : data.aiAnalysis.riskLevel === 'High' ? 'high' : 'medium',
                status: 'pending',
                complaint_ai_analysis: {
                    create: {
                        category: data.aiAnalysis.category,
                        sub_category: data.aiAnalysis.subCategory,
                        sentiment_score: data.aiAnalysis.sentimentScore,
                        risk_score: data.aiAnalysis.riskLevel === 'Critical' ? 95 : 50,
                        escalation_score: data.aiAnalysis.escalationScore,
                        extracted_keywords: data.aiAnalysis.keywords,
                        ai_summary: data.aiAnalysis.summary,
                        suggested_action: data.aiAnalysis.suggestedAction
                    }
                },
                ...(data.photoDataUrl && {
                    attachments: {
                        create: {
                            file_url: data.photoDataUrl,
                            file_type: "image/jpeg",
                            uploaded_by: citizen.id
                        }
                    }
                })
            }
        })

        revalidatePath('/citizen/history')
        revalidatePath('/citizen/dashboard')
        revalidatePath('/department/incoming')

        return { success: true, docketId: newComplaint.id.slice(-8).toUpperCase() }

    } catch (error) {
        console.error("Failed to insert complaint into DB:", error)
        return { success: false, error: "Database error" }
    }
}

export async function resolveComplaint(docketId: string) {
    try {
        const targetId = docketId.toLowerCase()

        // Find the complaint where the UUID ends with this slice
        // Prisma doesn't support endsWith on UUIDs directly in some databases, 
        // so we fetch the list and find it (fine for prototype size)
        const all = await db.complaints.findMany({
            select: { id: true }
        })
        const complaint = all.find(c => c.id.endsWith(targetId))

        if (!complaint) {
            return { success: false, error: "Complaint not found" }
        }

        await db.complaints.update({
            where: { id: complaint.id },
            data: { status: 'resolved' }
        })

        revalidatePath('/department/incoming')
        revalidatePath('/department/resolved')
        revalidatePath('/department/dashboard')
        revalidatePath('/department/analytics')
        revalidatePath('/citizen/history')
        revalidatePath('/citizen/dashboard')

        return { success: true }
    } catch (error) {
        console.error("Failed to resolve complaint:", error)
        return { success: false, error: "Database error" }
    }
}

