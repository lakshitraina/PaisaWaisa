import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import {
    collection, query, where, onSnapshot, addDoc, updateDoc,
    doc, arrayUnion, getDocs, deleteDoc, orderBy
} from "firebase/firestore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Users, Plus, UserPlus, LogOut, Trash2, Shield, CreditCard } from "lucide-react";

export default function FamilyCircle() {
    const { currentUser } = useAuth();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inviteCode, setInviteCode] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "families"),
            where("members", "array-contains", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const familyDoc = snapshot.docs[0];
                setFamily({ id: familyDoc.id, ...familyDoc.data() });
            } else {
                setFamily(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        if (!family?.id) return;

        const q = query(
            collection(db, "familyExpenses"),
            where("familyId", "==", family.id),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setExpenses(docs);
        });

        return unsubscribe;

    }, [family]);

    const createFamily = async () => {
        if (!familyName.trim()) return;
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        try {
            await addDoc(collection(db, "families"), {
                name: familyName,
                createdBy: currentUser.uid,
                inviteCode: code,
                members: [currentUser.uid],
                createdAt: new Date()
            });
        } catch (error) {
            console.error("Error creating family:", error);
        }
    };

    const joinFamily = async () => {
        if (!joinCode.trim()) return;

        try {
            const q = query(collection(db, "families"), where("inviteCode", "==", joinCode.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const familyDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, "families", familyDoc.id), {
                    members: arrayUnion(currentUser.uid)
                });

            } else {
                alert("Invalid invite code");
            }
        } catch (error) {
            console.error("Error joining family:", error);
        }
    };

    const leaveFamily = async () => {
        if (!window.confirm("Are you sure you want to leave this family?")) return;
        try {
            const updatedMembers = family.members.filter(uid => uid !== currentUser.uid);
            if (updatedMembers.length === 0) {
                await deleteDoc(doc(db, "families", family.id));
            } else {
                await updateDoc(doc(db, "families", family.id), {
                    members: updatedMembers
                });
            }
        } catch (error) {
            console.error("Error leaving family:", error);
        }
    };

    const addExpense = async (e) => {
        e.preventDefault();
        if (!expenseTitle.trim() || !expenseAmount) return;

        try {
            await addDoc(collection(db, "familyExpenses"), {
                familyId: family.id,
                title: expenseTitle,
                amount: parseFloat(expenseAmount),
                addedBy: currentUser.uid,
                addedByName: currentUser.email.split('@')[0],
                date: new Date()
            });
            setExpenseTitle("");
            setExpenseAmount("");
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await deleteDoc(doc(db, "familyExpenses", id));
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading family...</div>;

    if (!family) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-8 mt-10">
                    <Card className="p-6 space-y-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Plus className="text-primary h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold">Create a Family</h2>
                        <p className="text-muted-foreground">Start a new family circle to track shared expenses together.</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Family Name (e.g. The Smiths)"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                            />
                            <Button onClick={createFamily}>Create</Button>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <UserPlus className="text-secondary h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold">Join a Family</h2>
                        <p className="text-muted-foreground">Enter an invite code to join an existing family circle.</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter Invite Code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                            />
                            <Button variant="outline" onClick={joinFamily}>Join</Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="container mx-auto p-4 space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" />
                        {family.name}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Invite Code: <span className="font-mono bg-muted px-2 py-0.5 rounded">{family.inviteCode}</span>
                    </p>
                </div>
                <Button variant="destructive" size="sm" onClick={leaveFamily} className="gap-2">
                    <LogOut className="h-4 w-4" /> Leave Family
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 col-span-1 border-primary/20 bg-primary/5">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5" /> Total Household Spending
                    </h3>
                    <p className="text-4xl font-bold text-primary">₹{totalExpenses.toFixed(2)}</p>
                </Card>

                <Card className="p-6 col-span-2">
                    <h3 className="font-semibold text-lg mb-4">Add Shared Expense</h3>
                    <form onSubmit={addExpense} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="What was it for?"
                            className="flex-grow"
                            value={expenseTitle}
                            onChange={(e) => setExpenseTitle(e.target.value)}
                            required
                        />
                        <Input
                            type="number"
                            placeholder="Amount"
                            className="w-full sm:w-32"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            required
                        />
                        <Button type="submit">Add</Button>
                    </form>
                </Card>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">Recent Family Expenses</h3>
                </div>
                {expenses.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No shared expenses yet.</div>
                ) : (
                    <div className="divide-y">
                        {expenses.map(expense => (
                            <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground font-bold text-lg">
                                        {expense.addedByName?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <p className="font-medium">{expense.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Added by {expense.addedByName} • {new Date(expense.date?.toDate()).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-lg">₹{expense.amount.toFixed(2)}</span>
                                    {expense.addedBy === currentUser.uid && (
                                        <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" /> Family Members ({family.members.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                    {family.members.map(memberId => (
                        <div key={memberId} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            {memberId === currentUser.uid ? "You" : "Family Member"}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
