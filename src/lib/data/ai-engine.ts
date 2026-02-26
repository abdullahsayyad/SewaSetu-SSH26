export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type Department = "Electricity" | "Water" | "Roads" | "Sanitation" | "Public Safety" | "Unassigned";

export interface AIAnalysisResult {
    category: Department;
    subCategory: string;
    riskLevel: RiskLevel;
    escalationScore: number; // 0-100
    sentimentScore: number; // -1 to 1 (-1 most negative)
    keywords: string[];
    summary: string;
    suggestedAction: string;
    estimatedResolutionHours: number;
}

// Simulated keyword mapping to categories
const keywordMapping: Record<string, { dept: Department, baseScore: number, sub: string }> = {
    "electric": { dept: "Electricity", baseScore: 60, sub: "Power Outage" },
    "wire": { dept: "Electricity", baseScore: 80, sub: "Live Wire Danger" },
    "spark": { dept: "Electricity", baseScore: 85, sub: "Electrical Fire Risk" },
    "power": { dept: "Electricity", baseScore: 50, sub: "Power Outage" },

    "water": { dept: "Water", baseScore: 40, sub: "Supply Issue" },
    "pipeline": { dept: "Water", baseScore: 60, sub: "Pipeline Burst" },
    "leak": { dept: "Water", baseScore: 50, sub: "Water Leakage" },
    "drain": { dept: "Sanitation", baseScore: 40, sub: "Clogged Drain" },

    "road": { dept: "Roads", baseScore: 30, sub: "Road Damage" },
    "pothole": { dept: "Roads", baseScore: 35, sub: "Pothole" },
    "street": { dept: "Roads", baseScore: 30, sub: "Street Condition" },
    "light": { dept: "Electricity", baseScore: 30, sub: "Streetlight Broken" },

    "garbage": { dept: "Sanitation", baseScore: 40, sub: "Uncollected Garbage" },
    "trash": { dept: "Sanitation", baseScore: 40, sub: "Uncollected Garbage" },
    "smell": { dept: "Sanitation", baseScore: 30, sub: "Foul Odor" },

    "accident": { dept: "Public Safety", baseScore: 90, sub: "Traffic Accident" },
    "fire": { dept: "Public Safety", baseScore: 95, sub: "Fire Hazard" },
    "police": { dept: "Public Safety", baseScore: 85, sub: "Security Issue" },
    "crime": { dept: "Public Safety", baseScore: 85, sub: "Security Issue" }
};

const urgentKeywords = ["urgent", "immediately", "danger", "dying", "help", "critical", "fast", "emergency"];

export function simulateAIAnalysis(text: string): AIAnalysisResult {
    const lowerText = text.toLowerCase();

    let dept: Department = "Unassigned";
    let subCategory = "General Query";
    let highestBaseScore = 10;
    let matchedKeywords: string[] = [];

    // Find matching categories
    for (const [kw, data] of Object.entries(keywordMapping)) {
        if (lowerText.includes(kw)) {
            matchedKeywords.push(kw);
            if (data.baseScore > highestBaseScore) {
                highestBaseScore = data.baseScore;
                dept = data.dept;
                subCategory = data.sub;
            }
        }
    }

    // Calculate Escaltion Score
    let escalationScore = highestBaseScore;

    // Add points for urgent words
    const urgentMatches = urgentKeywords.filter(uk => lowerText.includes(uk));
    escalationScore += urgentMatches.length * 15;

    matchedKeywords = [...matchedKeywords, ...urgentMatches];

    // Cap at 100
    escalationScore = Math.min(100, escalationScore);

    // Determine Risk Level
    let riskLevel: RiskLevel = "Low";
    if (escalationScore > 75) riskLevel = "Critical";
    else if (escalationScore > 50) riskLevel = "High";
    else if (escalationScore > 25) riskLevel = "Moderate";

    // Simulate Sentiment (More urgent usually means more negative text)
    const sentimentScore = Math.max(-1, -0.1 - (escalationScore / 100));

    // Generate Summary Length constraints
    const summary = text.length > 60 ? text.substring(0, 60) + "..." : text;

    // Generate Suggested Action based on Risk
    let suggestedAction = "Standard review within SLA.";
    let estimatedResolutionHours = 72;

    if (riskLevel === "Critical") {
        suggestedAction = "Dispatch emergency response team immediately.";
        estimatedResolutionHours = 4;
    } else if (riskLevel === "High") {
        suggestedAction = "Prioritize for inspection today.";
        estimatedResolutionHours = 24;
    } else if (riskLevel === "Moderate") {
        suggestedAction = "Schedule standard maintenance.";
        estimatedResolutionHours = 48;
    }

    // Fallback map
    if (dept === "Unassigned") {
        dept = "Sanitation"; // default bucket for unmatched
        subCategory = "General Nuisance";
        matchedKeywords = ["general"];
        escalationScore = 20;
    }

    return {
        category: dept,
        subCategory,
        riskLevel,
        escalationScore,
        sentimentScore: parseFloat(sentimentScore.toFixed(2)),
        keywords: [...new Set(matchedKeywords)].slice(0, 4), // max 4 keywords
        summary,
        suggestedAction,
        estimatedResolutionHours
    };
}
