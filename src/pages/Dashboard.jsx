import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from "firebase/firestore";
import { Plus } from "lucide-react";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import SummaryCards from "../components/SummaryCards";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import Charts from "../components/Charts";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", currentUser.uid),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
            console.log("Snapshot update:", snapshot.docs.length, "docs", "Metadata:", snapshot.metadata);
            const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTransactions(docs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions: ", error);
            if (error.code === 'failed-precondition') {
                alert("Firestore requires an index for this query. Check the console for the link to create it.");
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const handleAddTransaction = async (data) => {
        try {
            if (editingTransaction) {
                await updateDoc(doc(db, "transactions", editingTransaction.id), {
                    ...data,
                    userId: currentUser.uid,
                });
            } else {
                await addDoc(collection(db, "transactions"), {
                    ...data,
                    userId: currentUser.uid,
                    createdAt: new Date(),
                });
            }
            setShowModal(false);
            setEditingTransaction(null);
        } catch (error) {
            console.error("Error adding/updating transaction: ", error);
            alert("Error saving transaction");
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await deleteDoc(doc(db, "transactions", id));
        } catch (error) {
            console.error("Error deleting transaction: ", error);
        }
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const [filterCategory, setFilterCategory] = useState("all");

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || t.type === filterType;
        const matchesCategory = filterCategory === "all" || t.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
    });

    const categories = ["Food", "Transport", "Entertainment", "Bills", "Health", "Salary", "Investment", "Other"];

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    return (
        <div className="container mx-auto p-4 space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button onClick={() => { setEditingTransaction(null); setShowModal(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </div>

            <SummaryCards income={income} expense={expense} balance={balance} />

            <Charts transactions={transactions} />

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sm:max-w-xs"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading transactions...</div>
                ) : (
                    <TransactionList
                        transactions={filteredTransactions}
                        onDelete={handleDeleteTransaction}
                        onEdit={handleEditTransaction}
                    />
                )}
            </div>

            {showModal && (
                <TransactionForm
                    onClose={() => { setShowModal(false); setEditingTransaction(null); }}
                    onSave={handleAddTransaction}
                    initialData={editingTransaction}
                />
            )}
        </div>
    );
}
