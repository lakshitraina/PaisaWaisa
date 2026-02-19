import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import CreditScoreCard from "../components/CreditScoreCard";
import { ShieldCheck, Info } from "lucide-react";

export default function CreditHealth() {
    const { currentUser } = useAuth();
    const [currentScore, setCurrentScore] = useState(700);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [factors, setFactors] = useState([]);
    const [predictedAdjustment, setPredictedAdjustment] = useState(0);

    // Calculation separated for clarity
    const calculatePrediction = (payments, activeLoans) => {
        const onTimeCount = payments.filter(p => p.status === 'on-time').length;
        const lateCount = payments.filter(p => p.status === 'late').length;

        const today = new Date();
        let missedCount = 0;
        activeLoans.forEach(loan => {
            const dueDate = new Date(loan.nextDueDate.seconds * 1000);
            if (dueDate < today) {
                missedCount++;
            }
        });

        let adjustment = 0;
        const newFactors = [];

        if (onTimeCount > 0) {
            const points = onTimeCount * 5;
            adjustment += points;
            newFactors.push({ label: `On-time Payments (${onTimeCount})`, points: `+${points}`, type: 'good' });
        }

        if (lateCount > 0) {
            const points = lateCount * 10;
            adjustment -= points;
            newFactors.push({ label: `Late Payments (${lateCount})`, points: `-${points}`, type: 'bad' });
        }

        if (missedCount > 0) {
            const points = missedCount * 20;
            adjustment -= points;
            newFactors.push({ label: `Missed/Overdue EMIs (${missedCount})`, points: `-${points}`, type: 'bad' });
        }

        setFactors(newFactors);
        setPredictedAdjustment(adjustment);
        setLoading(false);
    };

    useEffect(() => {
        if (!currentUser) return;

        setLoading(true);

        // 1. Listen to User's Current Score
        const userRef = doc(db, "users", currentUser.uid);
        const unsubUser = onSnapshot(userRef, (doc) => {
            if (doc.exists() && doc.data().creditScore) {
                setCurrentScore(doc.data().creditScore);
            }
        });

        // 2. Listen to EMI Payments & Active Loans for Prediction
        const emiQuery = query(collection(db, "emiPayments"), where("userId", "==", currentUser.uid));
        const loanQuery = query(collection(db, "loans"), where("userId", "==", currentUser.uid), where("status", "==", "active"));

        // Real-time implementation for factors
        const unsubFactors = onSnapshot(emiQuery, (emiSnapshot) => {
            const payments = emiSnapshot.docs.map(d => d.data());

            // Nested listener for loans to ensure we have latest due dates
            const unsubLoans = onSnapshot(loanQuery, (loanSnapshot) => {
                const activeLoans = loanSnapshot.docs.map(d => d.data());
                calculatePrediction(payments, activeLoans);
            });

            return () => unsubLoans();
        });

        return () => {
            unsubUser();
            unsubFactors();
        };
    }, [currentUser]);

    const predictedScoreValue = Math.max(300, Math.min(900, currentScore + predictedAdjustment));

    const handleUpdateScore = async () => {
        try {
            await updateDoc(doc(db, "users", currentUser.uid), {
                creditScore: parseInt(currentScore)
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating score:", error);
            alert("Failed to update score");
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading credit health...</div>;

    return (
        <div className="container mx-auto p-4 pb-20 space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Credit Health
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <CreditScoreCard currentScore={currentScore} predictedScore={predictedScoreValue} />

                    <div className="mt-6">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-2">Update Current Score</h3>
                            <p className="text-xs text-muted-foreground mb-4">
                                Manually update your score from an external bureau to keep the prediction accurate.
                            </p>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={currentScore}
                                        onChange={(e) => setCurrentScore(parseInt(e.target.value) || 0)}
                                        min="300"
                                        max="900"
                                    />
                                    <Button onClick={handleUpdateScore}>Save</Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                </div>
                            ) : (
                                <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                                    Edit Score manually
                                </Button>
                            )}
                        </Card>
                    </div>
                </div>

                <div className="space-y-4">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Info className="h-4 w-4" /> Prediction Factors
                        </h3>
                        {factors.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No activity detected yet. Pay EMIs to see factors affecting your score.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {factors.map((factor, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm border-b last:border-0 pb-2 last:pb-0">
                                        <span>{factor.label}</span>
                                        <span className={`font-bold ${factor.type === 'good' ? 'text-green-500' : 'text-red-500'}`}>
                                            {factor.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 bg-muted/30 p-3 rounded text-xs text-muted-foreground">
                            *This is a simulation based on your in-app payment behavior. Actual bureau scores may vary.
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
