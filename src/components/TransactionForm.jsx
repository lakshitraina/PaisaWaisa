import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

export default function TransactionForm({ onClose, onSave, initialData, isModal = true }) {
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            amount: parseFloat(formData.amount)
        });
    };

    const FormContent = (
        <Card className={`w-full max-w-md p-6 space-y-6 relative ${isModal ? "animate-in fade-in zoom-in-95 duration-200" : ""}`}>
            {isModal && (
                <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            )}

            <h2 className="text-2xl font-bold">{initialData ? "Edit Transaction" : "Add Transaction"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Grocery Shopping"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Bills">Bills</option>
                        <option value="Health">Health</option>
                        <option value="Salary">Salary</option>
                        <option value="Investment">Investment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Button type="submit" className="w-full">
                    {initialData ? "Update Transaction" : "Add Transaction"}
                </Button>
            </form>
        </Card>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                {FormContent}
            </div>
        );
    }

    return FormContent;
}
