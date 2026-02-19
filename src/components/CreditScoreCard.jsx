import { Card } from "./ui/Card";
import { Gauge, TrendingUp, AlertTriangle } from "lucide-react";

export default function CreditScoreCard({ currentScore, predictedScore }) {

    const getScoreColor = (score) => {
        if (score >= 750) return "text-green-500";
        if (score >= 700) return "text-blue-500";
        if (score >= 650) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreLabel = (score) => {
        if (score >= 750) return "Excellent";
        if (score >= 700) return "Good";
        if (score >= 650) return "Fair";
        return "Poor";
    };

    const percentage = ((currentScore - 300) / 600) * 100;
    const predictedPercentage = ((predictedScore - 300) / 600) * 100;

    return (
        <Card className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Gauge className="h-5 w-5" /> Credit Health
            </h3>

            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-muted/20"
                    />
                    {/* Current Score Progress */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * percentage) / 100}
                        className={`${getScoreColor(currentScore)} transition-all duration-1000 ease-out`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                        {currentScore}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">{getScoreLabel(currentScore)}</span>
                </div>
            </div>

            <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Current Score</span>
                    <span className="font-semibold">{currentScore}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" /> Predicted (Next Month)
                    </span>
                    <span className={`font-bold ${predictedScore >= currentScore ? "text-green-500" : "text-red-500"}`}>
                        {predictedScore}
                    </span>
                </div>
                {predictedScore < currentScore && (
                    <div className="bg-destructive/10 text-destructive text-xs p-2 rounded flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Late payments or high debt detected. Pay EMIs on time to improve.</span>
                    </div>
                )}
            </div>
        </Card>
    );
}
