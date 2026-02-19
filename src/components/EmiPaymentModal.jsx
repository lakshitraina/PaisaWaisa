import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { X, CheckCircle2 } from "lucide-react";
import { addDoc, collection, query, where, orderBy, updateDoc, doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

// Helper to update credit score
const updateCreditScore = async (userId, points) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        let currentScore = 700;
        if (userSnap.exists() && userSnap.data().creditScore) {
            currentScore = userSnap.data().creditScore;
        } else if (!userSnap.exists()) {
            // Create if doesn't exist
            await setDoc(userRef, { email: "user@example.com", creditScore: 700 }, { merge: true });
        }

        const newScore = Math.min(900, Math.max(300, currentScore + points));

        await updateDoc(userRef, {
            creditScore: newScore
        });
    } catch (e) {
        console.error("Error updating credit score:", e);
    }
};

export default function EmiPaymentModal({ loan, onClose, onPaymentSuccess }) {
    const { currentUser } = useAuth();
    const [amount, setAmount] = useState(loan.emiAmount);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        if (!loan?.id) return;

        const q = query(
            collection(db, "emiPayments"),
            where("loanId", "==", loan.id),
            orderBy("paidOn", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoadingHistory(false);
        });

        return () => unsubscribe();
    }, [loan]);

    const handlePayment = async () => {
        onClose(); // Close immediately for better UX
        try {
            const payAmount = parseFloat(amount);
            if (payAmount <= 0) return;

            // 1. Record Payment
            await addDoc(collection(db, "emiPayments"), {
                loanId: loan.id,
                userId: currentUser.uid,
                amount: payAmount,
                paidOn: new Date(paymentDate),
                status: "on-time"
            });

            // 2. Update Loan Balance
            const newRemaining = Math.max(0, loan.remainingAmount - payAmount);
            // Calculate next due date (simple +1 month logic for now)
            const nextDue = new Date(loan.nextDueDate.seconds * 1000);
            nextDue.setMonth(nextDue.getMonth() + 1);

            await updateDoc(doc(db, "loans", loan.id), {
                remainingAmount: newRemaining,
                nextDueDate: nextDue,
                status: newRemaining === 0 ? "completed" : "active"
            });

            // 3. Update Credit Score (+5 points for on-time payment)
            await updateCreditScore(currentUser.uid, 5);

            // alert("EMI Paid Successfully! (+5 Credit Score)"); // Removed alert for smoother flow, or maybe use toast
            onPaymentSuccess();

        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed");
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-lg border shadow-lg relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-1">Manage EMI: {loan.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">Record a payment or view history.</p>

                <div className="space-y-4 mb-6">
                    <div className="bg-muted/30 p-4 rounded-lg border">
                        <label className="text-sm font-medium block mb-2">Record Payment</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="w-32"
                            />
                            <Button onClick={handlePayment}>Pay</Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <h3 className="font-semibold mb-2 text-sm">Payment History</h3>
                    {loadingHistory ? (
                        <p className="text-sm text-muted-foreground">Loading history...</p>
                    ) : history.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {history.map(pay => (
                                <div key={pay.id} className="flex justify-between items-center p-3 bg-card border rounded-md text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Paid ₹{pay.amount.toLocaleString()}</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {new Date(pay.paidOn.seconds * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
