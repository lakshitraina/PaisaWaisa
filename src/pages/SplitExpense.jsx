import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import {
    collection, query, where, onSnapshot, addDoc, doc, getDoc, orderBy, updateDoc, arrayUnion
} from "firebase/firestore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Split, User, CheckCircle2, ArrowRight } from "lucide-react";
import { getDateObject } from "../lib/utils";

export default function SplitExpense() {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [splits, setSplits] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [payer, setPayer] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "families"),
            where("members", "array-contains", currentUser.uid)
        );
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!snapshot.empty) {
                const familyData = snapshot.docs[0].data();
                const members = await Promise.all(familyData.members.map(async (uid) => {
                    if (uid === currentUser.uid) return { uid, name: "You" };
                    const userSnap = await getDoc(doc(db, "users", uid));
                    return { uid, name: userSnap.exists() ? userSnap.data().name : "Unknown Member" };
                }));
                setFamilyMembers(members);
                setPayer(currentUser.uid);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "splitExpenses"),
            where("participants", "array-contains", currentUser.uid),
            orderBy("date", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSplits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("Error fetching split expenses:", error);
            if (error.code === 'failed-precondition') {
                alert("Firestore requires an index for this query. Check the console for the link to create it.");
            }
        });
        return unsubscribe;
    }, [currentUser]);


    const handleToggleMember = (uid) => {
        if (selectedMembers.includes(uid)) {
            setSelectedMembers(prev => prev.filter(id => id !== uid));
        } else {
            setSelectedMembers(prev => [...prev, uid]);
        }
    };

    const handleSplit = async (e) => {
        e.preventDefault();
        if (!amount || !title || selectedMembers.length === 0 || !payer) return;

        const totalAmount = parseFloat(amount);

        const participants = [...new Set([...selectedMembers, currentUser.uid])];
        const splitAmount = totalAmount / participants.length;

        try {
            await addDoc(collection(db, "splitExpenses"), {
                title,
                totalAmount,
                paidBy: payer,
                participants,
                settledBy: [payer], // Payer has already "paid"
                splitAmount,
                date: new Date()
            });
            setTitle("");
            setAmount("");
            setSelectedMembers([]);
            setPayer(currentUser.uid);
            alert("Expense split added!");
        } catch (error) {
            console.error("Error adding split:", error);
            alert("Failed to add split. Check console.");
        }
    };

    const handleSettle = async (splitId) => {
        try {
            const splitRef = doc(db, "splitExpenses", splitId);
            await updateDoc(splitRef, {
                settledBy: arrayUnion(currentUser.uid)
            });
            alert("Marked as paid back!");
        } catch (error) {
            console.error("Error settling expense:", error);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6 pb-20">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Split className="h-8 w-8 text-primary" />
                Split Expenses
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">New Split</h2>
                    <form onSubmit={handleSplit} className="space-y-4">
                        <Input
                            placeholder="Expense Title (e.g. Dinner)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <Input
                            type="number"
                            placeholder="Total Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />

                        <div>
                            <p className="text-sm font-medium mb-2">Split with:</p>
                            <div className="flex flex-wrap gap-2">
                                {loading && <span className="text-xs text-muted-foreground">Loading family...</span>}
                                {!loading && familyMembers.length === 0 && <span className="text-xs text-muted-foreground">Join a family to split expenses!</span>}
                                {familyMembers.filter(m => m.uid !== currentUser.uid).map(member => (
                                    <div
                                        key={member.uid}
                                        onClick={() => handleToggleMember(member.uid)}
                                        className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm flex items-center gap-2 transition-colors ${selectedMembers.includes(member.uid) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
                                    >
                                        <User className="h-3 w-3" />
                                        {member.name}
                                        {selectedMembers.includes(member.uid) && <CheckCircle2 className="h-3 w-3" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Who paid?</p>
                            <select
                                className="w-full p-2 rounded-md border bg-background"
                                value={payer}
                                onChange={(e) => setPayer(e.target.value)}
                            >
                                {familyMembers.map(member => (
                                    <option key={member.uid} value={member.uid}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {amount && selectedMembers.length > 0 && (
                            <div className="bg-muted p-3 rounded-md text-sm">
                                Split amount: <span className="font-bold">₹{(parseFloat(amount) / (selectedMembers.length + 1)).toFixed(2)} / person</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={selectedMembers.length === 0}>
                            Split It
                        </Button>
                    </form>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Recent Splits</h2>
                    {splits.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No split expenses found.</p>
                    ) : (
                        splits.map(split => (
                            <Card key={split.id} className="p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{split.title}</h3>
                                        <p className="text-xs text-muted-foreground">{getDateObject(split.date)?.toLocaleDateString() || 'N/A'}</p>
                                    </div>
                                    <span className="font-bold text-lg">₹{split.totalAmount}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="text-sm flex flex-col gap-1 text-muted-foreground">
                                        <div className="flex justify-between items-center">
                                            <span>
                                                {split.paidBy === currentUser.uid ? "You" : (familyMembers.find(m => m.uid === split.paidBy)?.name || "Someone")} paid
                                            </span>
                                            <span>₹{split.splitAmount?.toFixed(2)} / person</span>
                                        </div>

                                        {split.paidBy !== currentUser.uid && split.participants.includes(currentUser.uid) && (
                                            <div className="mt-2 text-right">
                                                {split.settledBy?.includes(currentUser.uid) ? (
                                                    <span className="text-green-500 text-xs font-bold flex items-center justify-end gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> Paid Back
                                                    </span>
                                                ) : (
                                                    <Button size="sm" variant="outline" onClick={() => handleSettle(split.id)} className="h-7 text-xs">
                                                        Pay Back ₹{split.splitAmount?.toFixed(2)}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                        {split.paidBy === currentUser.uid && (
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                People owe you: {split.participants.filter(p => p !== currentUser.uid && !split.settledBy?.includes(p)).length} pending
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex -space-x-2 mt-3">
                                        {split.participants.map(p => (
                                            <div key={p} className={`h-6 w-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] ${split.settledBy?.includes(p) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`} title={familyMembers.find(m => m.uid === p)?.name || "Member"}>
                                                <User className="h-3 w-3" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
