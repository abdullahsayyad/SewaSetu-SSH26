import { AIAnalysisResult, Department } from "./ai-engine";

export type ComplaintStatus = "Open" | "In Progress" | "Resolved";

export interface Complaint {
    id: string;
    citizenId: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    photoUrl?: string | null;
    createdAt: string;
    status: ComplaintStatus;
    aiAnalysis: AIAnalysisResult;
    resolutionNotes?: string;
    resolvedAt?: string;
}

// Coordinate center for simulation (Indore, Madhya Pradesh)
export const CITY_CENTER = { lat: 22.7196, lng: 75.8577 };

// Helper to generate slightly random coordinates around center
function randomCoord(base: number, variance: number) {
    return base + (Math.random() - 0.5) * variance;
}

export const MOCK_COMPLAINTS: Complaint[] = [
    {
        id: "C-9281A",
        citizenId: "user_1",
        description: "There is a massive pothole near the BRTS corridor causing major traffic issues and vehicle damage. Needs urgent repair.",
        location: { lat: 22.7533, lng: 75.8937, address: "Vijay Nagar, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Roads", subCategory: "Pothole", riskLevel: "High", escalationScore: 65, sentimentScore: -0.7, keywords: ["pothole", "traffic", "urgent"], summary: "Massive pothole causing major traffic issues...", suggestedAction: "Prioritize for inspection today.", estimatedResolutionHours: 24 }
    },
    {
        id: "C-4412B",
        citizenId: "user_2",
        description: "Live electrical wire fell on the sidewalk near the market! This is extremely dangerous, please send someone immediately!",
        location: { lat: 22.7180, lng: 75.8550, address: "Rajwada Market, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Electricity", subCategory: "Live Wire Danger", riskLevel: "Critical", escalationScore: 98, sentimentScore: -0.95, keywords: ["wire", "dangerous", "immediately"], summary: "Live electrical wire fell on the sidewalk...", suggestedAction: "Dispatch emergency response team immediately.", estimatedResolutionHours: 4 }
    },
    {
        id: "C-1102C",
        citizenId: "user_3",
        description: "Garbage hasn't been collected for 3 days in our residential area. The smell is awful.",
        location: { lat: 22.7244, lng: 75.8839, address: "Old Palasia, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Sanitation", subCategory: "Uncollected Garbage", riskLevel: "Moderate", escalationScore: 40, sentimentScore: -0.5, keywords: ["garbage", "smell"], summary: "Garbage hasn't been collected for 3 days...", suggestedAction: "Schedule standard maintenance.", estimatedResolutionHours: 48 }
    },
    {
        id: "C-8821D",
        citizenId: "user_1",
        description: "Water pipe burst on main road, flooding the street.",
        location: { lat: 22.6916, lng: 75.8672, address: "Bhavarkuan, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Water", subCategory: "Pipeline Burst", riskLevel: "High", escalationScore: 70, sentimentScore: -0.8, keywords: ["water", "pipe", "flooding"], summary: "Water pipe burst on main street, flooding...", suggestedAction: "Prioritize for inspection today.", estimatedResolutionHours: 24 }
    },
    {
        id: "C-3389E",
        citizenId: "user_4",
        description: "Streetlights have been out for a week near the hospital, making it unsafe at night.",
        location: { lat: 22.7120, lng: 75.8647, address: "MY Hospital Road, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Electricity", subCategory: "Streetlight Outage", riskLevel: "High", escalationScore: 75, sentimentScore: -0.6, keywords: ["streetlights", "unsafe", "hospital"], summary: "Streetlights out for a week near the hospital...", suggestedAction: "Assign repair crew tomorrow.", estimatedResolutionHours: 48 }
    },
    {
        id: "C-9901F",
        citizenId: "user_5",
        description: "Sewage overflow near the main intersection, foul smell and health hazard.",
        location: { lat: 22.7300, lng: 75.8750, address: "LIG Square, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Sanitation", subCategory: "Sewage Leak", riskLevel: "Critical", escalationScore: 90, sentimentScore: -0.9, keywords: ["sewage", "overflow", "hazard"], summary: "Sewage overflow causing health hazard...", suggestedAction: "Immediate dispatch required.", estimatedResolutionHours: 12 }
    },
    {
        id: "C-2256G",
        citizenId: "user_6",
        description: "Major traffic signal malfunctioning during rush hour.",
        location: { lat: 22.7485, lng: 75.8850, address: "Khajrana Square, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Roads", subCategory: "Signal Failure", riskLevel: "High", escalationScore: 85, sentimentScore: -0.7, keywords: ["traffic", "signal", "rush hour"], summary: "Traffic signal malfunction at major square...", suggestedAction: "Alert traffic police and repair immediately.", estimatedResolutionHours: 6 }
    },
    {
        id: "C-5582H",
        citizenId: "user_7",
        description: "Fallen tree blocking half the road after yesterday's storm.",
        location: { lat: 22.7150, lng: 75.8900, address: "Geeta Bhawan Square, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Roads", subCategory: "Obstruction", riskLevel: "Moderate", escalationScore: 50, sentimentScore: -0.4, keywords: ["tree", "blocking", "storm"], summary: "Fallen tree blocking the road...", suggestedAction: "Schedule clearing crew.", estimatedResolutionHours: 36 }
    },
    {
        id: "C-1199I",
        citizenId: "user_8",
        description: "Contaminated drinking water supply reported in residential complex.",
        location: { lat: 22.7600, lng: 75.8900, address: "Nipania, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Water", subCategory: "Contamination", riskLevel: "Critical", escalationScore: 95, sentimentScore: -0.95, keywords: ["contaminated", "water", "supply"], summary: "Contaminated drinking water reported...", suggestedAction: "Shut off supply and inspect immediately.", estimatedResolutionHours: 8 }
    },
    {
        id: "C-6623J",
        citizenId: "user_9",
        description: "Stray dog menace near the local park, several minor incidents reported.",
        location: { lat: 22.7050, lng: 75.8500, address: "Annapurna Area, Indore" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        status: "Open",
        aiAnalysis: { category: "Sanitation", subCategory: "Animal Control", riskLevel: "Low", escalationScore: 30, sentimentScore: -0.3, keywords: ["stray dog", "park", "incidents"], summary: "Stray dog menace near the park...", suggestedAction: "Notify animal control unit for routine check.", estimatedResolutionHours: 72 }
    }
];

export const MOCK_NOTIFICATIONS = [
    { id: 1, title: "Critical Alert", message: "Live wire reported at Central Park West", time: "30m ago", read: false, type: "critical" },
    { id: 2, title: "SLA Warning", message: "Complaint C-1102C approaching SLA breach", time: "2h ago", read: false, type: "warning" },
];

// Mutator to add new complaints to the memory array
export function addComplaint(complaint: Complaint) {
    MOCK_COMPLAINTS.unshift(complaint);
}
