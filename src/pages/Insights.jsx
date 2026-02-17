import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Card } from "../components/ui/Card";
import HeatmapCalendar from "../components/HeatmapCalendar";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { getDateObject } from "../lib/utils";

export default function Insights() {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "transactions"),
            where("userId", "==", currentUser.uid),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return unsubscribe;
    }, [currentUser]);

    const income = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    const categoryData = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const pieData = Object.keys(categoryData).map(key => ({ name: key, value: categoryData[key] }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const monthlyData = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => {
            const date = getDateObject(t.date);
            if (date) {
                const month = date.toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + t.amount;
            }
            return acc;
        }, {});

    const barData = Object.keys(monthlyData).map(key => ({ name: key, amount: monthlyData[key] }));

    if (loading) return <div className="p-8 text-center bg-background min-h-screen">Loading insights...</div>;

    return (
        <div className="container mx-auto p-4 space-y-6 pb-20">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                Financial Insights
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-muted-foreground font-medium mb-2">Savings Rate</h3>
                    <div className={`text-4xl font-bold ${savingsRate >= 20 ? "text-green-500" : "text-yellow-500"}`}>
                        {savingsRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {savingsRate >= 20 ? "Great job! You're saving well." : "Try to reduce expenses to save more."}
                    </p>
                </Card>

                <Card className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-muted-foreground font-medium mb-2">Top Spending Category</h3>
                    <div className="text-2xl font-bold text-primary">
                        {pieData.sort((a, b) => b.value - a.value)[0]?.name || "None"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        ₹{pieData.sort((a, b) => b.value - a.value)[0]?.value.toFixed(2) || "0.00"}
                    </p>
                </Card>

                <Card className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-muted-foreground font-medium mb-2">Total Net Worth</h3>
                    <div className="text-4xl font-bold text-primary">
                        ₹{(income - expense).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Income - Expenses
                    </p>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Spending Intensity (Last 365 Days)</h3>
                <HeatmapCalendar transactions={transactions} />
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 min-h-[300px]">
                    <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                        <PieIcon className="h-4 w-4" /> Expense Breakdown
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 min-h-[300px]">
                    <h3 className="font-semibold mb-4 text-lg">Monthly Trends</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip formatter={(value) => `₹${value}`} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
