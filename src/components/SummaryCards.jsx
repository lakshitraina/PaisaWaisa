import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { Card } from "./ui/Card";
import { formatCurrency } from "../lib/utils";

export default function SummaryCards({ income, expense, balance }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-medium">Total Balance</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            </Card>

            <Card className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-green-500">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">Total Income</span>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(income)}
                </div>
            </Card>

            <Card className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-red-500">
                    <ArrowDownRight className="h-4 w-4" />
                    <span className="text-sm font-medium">Total Expenses</span>
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(expense)}
                </div>
            </Card>
        </div>
    );
}
