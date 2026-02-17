import { Trash2, Edit2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { formatCurrency, formatDate } from "../lib/utils";

export default function TransactionList({ transactions, onDelete, onEdit }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No transactions found. Add one to get started!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">{transaction.title}</span>
                        <div className="text-xs text-muted-foreground flex gap-2">
                            <span>{formatDate(transaction.date)}</span>
                            <span>•</span>
                            <span>{transaction.category}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
