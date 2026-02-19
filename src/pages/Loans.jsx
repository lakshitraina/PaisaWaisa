import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Plus, Trash2, Calendar, IndianRupee, Percent } from "lucide-react";
import AddLoanForm from "../components/AddLoanForm";
import EmiPaymentModal from "../components/EmiPaymentModal";

export default function Loans() {
    const { currentUser } = useAuth();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "loans"),
            where("userId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sortedLoans = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); // Sort by createdAt desc
            setLoans(sortedLoans);
            setLoading(false);
        }, (error) => {

            console.error("Error fetching loans:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleAddLoan = async (loanData) => {
        setShowAddModal(false); // Close immediately for better UX
        try {
            await addDoc(collection(db, "loans"), {
                ...loanData,
                userId: currentUser.uid,
                createdAt: new Date()
            });
        } catch (error) {
            console.error("Error adding loan:", error);
            alert("Failed to add loan");
        }
    };

    const handleDeleteLoan = async (loanId) => {
        if (!window.confirm("Are you sure you want to delete this loan?")) return;
        try {
            await deleteDoc(doc(db, "loans", loanId));
        } catch (error) {
            console.error("Error deleting loan:", error);
        }
    };

    return (
        <div className="container mx-auto p-4 pb-20 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <IndianRupee className="h-6 w-6 text-primary" />
                    Loan Management
                </h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Loan
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading loans...</div>
            ) : loans.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                    <p>No active loans found. Create one to start tracking!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loans.map((loan) => (
                        <Card key={loan.id} className="p-5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{loan.name}</h3>
                                    <p className="text-xs text-muted-foreground">{loan.status === 'active' ? 'Active' : 'Closed'}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteLoan(loan.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Amount</span>
                                    <span className="font-semibold">₹{loan.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">EMI Amount</span>
                                    <span className="font-bold text-primary">₹{loan.emiAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> {loan.interestRate}% Interest</span>
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {loan.tenure} Months</span>
                                </div>

                                <div className="pt-3 mt-3 border-t">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-medium">Repayment Progress</span>
                                        <span className="text-xs text-muted-foreground">
                                            ₹{(loan.totalAmount - loan.remainingAmount).toLocaleString()} / ₹{loan.totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-3">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100}%` }}
                                        />
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedLoan(loan)}>
                                        Manage EMI & History
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddLoanForm
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddLoan}
                />
            )}

            {selectedLoan && (
                <EmiPaymentModal
                    loan={selectedLoan}
                    onClose={() => setSelectedLoan(null)}
                    onPaymentSuccess={() => setSelectedLoan(null)} // Refresh will happen via snapshot listener automatically
                />
            )}
        </div>
    );
}
