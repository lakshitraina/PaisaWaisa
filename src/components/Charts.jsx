import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "./ui/Card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function Charts({ transactions }) {
    // Process data for Pie Chart (Expense by Category)
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryData = expenseTransactions.reduce((acc, curr) => {
        if (acc[curr.category]) {
            acc[curr.category] += curr.amount;
        } else {
            acc[curr.category] = curr.amount;
        }
        return acc;
    }, {});

    const pieData = Object.keys(categoryData).map(category => ({
        name: category,
        value: categoryData[category]
    }));

    // Process data for Bar Chart (Income vs Expense)
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    const barData = [
        { name: "Income", amount: income },
        { name: "Expense", amount: expense }
    ];

    if (transactions.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 flex flex-col items-center">
                <h3 className="mb-4 text-lg font-semibold">Spending by Category</h3>
                <div className="h-[300px] w-full">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">No expense data</div>
                    )}
                </div>
            </Card>

            <Card className="p-6 flex flex-col items-center">
                <h3 className="mb-4 text-lg font-semibold">Income vs Expense</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)} />
                            <Bar dataKey="amount" fill="#8884d8">
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#82ca9d' : '#FF8042'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
