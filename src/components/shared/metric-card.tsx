import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
    title: string
    value: string | number
    description?: string
    icon?: LucideIcon
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    critical?: boolean
}

export function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendValue,
    critical = false,
}: MetricCardProps) {
    return (
        <Card className={critical ? "border-red-500 bg-red-50" : ""}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        <h3 className={`text-3xl font-bold tracking-tight ${critical ? "text-red-700" : "text-slate-900"}`}>{value}</h3>
                    </div>
                    {Icon && (
                        <div className={`p-3 rounded-lg ${critical ? "bg-red-100 text-red-600" : "bg-slate-100 text-[#0B3D91]"}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {(description || trendValue) && (
                    <div className="mt-4 flex items-center text-sm">
                        {trendValue && (
                            <span
                                className={`mr-2 font-medium ${trend === "up" && critical
                                        ? "text-red-600"
                                        : trend === "up" && !critical
                                            ? "text-[#138808]" // Good increase (like resolutions)
                                            : trend === "down"
                                                ? "text-[#138808]" // Good decrease
                                                : "text-slate-500"
                                    }`}
                            >
                                {trend === "up" ? "↑" : trend === "down" ? "↓" : "−"} {trendValue}
                            </span>
                        )}
                        {description && <span className="text-slate-500">{description}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
