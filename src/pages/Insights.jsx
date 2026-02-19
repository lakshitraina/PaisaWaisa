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
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        // Fetch Transactions
        const qTransactions = query(
            collection(db, "transactions"),
            where("userId", "==", currentUser.uid),
            orderBy("date", "desc")
        );

        const unsubscribeTransactions = onSnapshot(qTransactions, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        // Fetch Loans
        const qLoans = query(
            collection(db, "loans"),
            where("userId", "==", currentUser.uid),
            where("status", "==", "active")
        );

        const unsubscribeLoans = onSnapshot(qLoans, (snapshot) => {
            setLoans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeTransactions();
            unsubscribeLoans();
        };
    }, [currentUser]);

    // Transaction Metrics
    const income = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    // Monthly Income Calculation for DTI
    const monthlyIncomeData = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => {
            const date = getDateObject(t.date);
            if (date) {
                const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
                acc[month] = (acc[month] || 0) + t.amount;
            }
            return acc;
        }, {});

    const incomeMonths = Object.keys(monthlyIncomeData).length || 1;
    const avgMonthlyIncome = income / (incomeMonths || 1);

    // Loan Metrics
    const totalLoanAmount = loans.reduce((acc, loan) => acc + loan.totalAmount, 0);
    const totalRemainingDebt = loans.reduce((acc, loan) => acc + loan.remainingAmount, 0);
    const totalPaidDebt = totalLoanAmount - totalRemainingDebt;
    const totalMonthlyEmi = loans.reduce((acc, loan) => acc + loan.emiAmount, 0);

    // Debt-to-Income Ratio
    const dtiRatio = avgMonthlyIncome > 0 ? (totalMonthlyEmi / avgMonthlyIncome) * 100 : 0;

    // Projected Debt Free Time
    const monthsToDebtFree = totalMonthlyEmi > 0 ? Math.ceil(totalRemainingDebt / totalMonthlyEmi) : 0;

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

            {/* General Financial Health */}
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
                    <h3 className="text-muted-foreground font-medium mb-2">Net Worth (Cash Flow)</h3>
                    <div className={`text-4xl font-bold ${income - expense >= 0 ? "text-green-600" : "text-red-500"}`}>
                        ₹{(income - expense).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Total Income - Total Expenses
                    </p>
                </Card>
            </div>

            {/* Loan Insights Section */}
            {loans.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary" /> Debt Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-5">
                            <h3 className="text-sm text-muted-foreground mb-1">Total Active Debt</h3>
                            <div className="text-2xl font-bold text-destructive">₹{totalRemainingDebt.toLocaleString()}</div>
                            <div className="w-full bg-secondary h-1.5 mt-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full"
                                    style={{ width: `${(totalPaidDebt / totalLoanAmount) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {((totalPaidDebt / totalLoanAmount) * 100).toFixed(0)}% Paid Off
                            </p>
                        </Card>

                        <Card className="p-5">
                            <h3 className="text-sm text-muted-foreground mb-1">Monthly EMI Burden</h3>
                            <div className="text-2xl font-bold">₹{totalMonthlyEmi.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Fixed monthly outflow
                            </p>
                        </Card>

                        <Card className="p-5">
                            <h3 className="text-sm text-muted-foreground mb-1">Debt-to-Income (DTI)</h3>
                            <div className={`text-2xl font-bold ${dtiRatio > 40 ? "text-red-500" : dtiRatio > 20 ? "text-yellow-500" : "text-green-500"}`}>
                                {dtiRatio.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {dtiRatio > 40 ? "High Risk > 40%" : "Healthy Range < 30%"}
                            </p>
                        </Card>

                        <Card className="p-5">
                            <h3 className="text-sm text-muted-foreground mb-1">Debt Free In</h3>
                            <div className="text-2xl font-bold flex items-end gap-1">
                                {monthsToDebtFree} <span className="text-sm font-normal text-muted-foreground mb-1">Months</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Est. {new Date(new Date().setMonth(new Date().getMonth() + monthsToDebtFree)).toLocaleString('default', { month: 'short', year: 'numeric' })}
                            </p>
                        </Card>
                    </div>
                </div>
            )}

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
