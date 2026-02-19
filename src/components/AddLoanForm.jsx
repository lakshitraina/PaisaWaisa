import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { X, RefreshCw } from "lucide-react";

export default function AddLoanForm({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [tenure, setTenure] = useState("");
    const [emi, setEmi] = useState(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        if (isManual) return; // Don't overwrite if user manually set it

        if (totalAmount && interestRate && tenure) {
            const principal = parseFloat(totalAmount);
            const rate = parseFloat(interestRate) / 12 / 100;
            const time = parseFloat(tenure);

            if (principal > 0 && rate > 0 && time > 0) {
                const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
                setEmi(Math.round(emiValue));
            } else {
                setEmi(0);
            }
        }
    }, [totalAmount, interestRate, tenure, isManual]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            name,
            totalAmount: parseFloat(totalAmount),
            interestRate: parseFloat(interestRate),
            tenure: parseFloat(tenure),
            emiAmount: emi,
            remainingAmount: parseFloat(totalAmount),
            startDate: new Date(startDate),
            nextDueDate: new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)),
            status: "active"
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md border shadow-lg relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Add New Loan</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Loan Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Car Loan, Home Loan"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Amount (₹)</label>
                            <Input
                                type="number"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                placeholder="0.00"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Interest Rate (%)</label>
                            <Input
                                type="number"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                placeholder="Annual Rate"
                                required
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Tenure (Months)</label>
                            <Input
                                type="number"
                                value={tenure}
                                onChange={(e) => setTenure(e.target.value)}
                                placeholder="Months"
                                required
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Start Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Monthly EMI Amount</label>
                            {isManual && (
                                <button
                                    type="button"
                                    onClick={() => setIsManual(false)}
                                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                                >
                                    <RefreshCw className="h-3 w-3" /> Auto-calculate
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                type="number"
                                value={emi}
                                onChange={(e) => {
                                    setEmi(parseInt(e.target.value) || 0);
                                    setIsManual(true);
                                }}
                                className="font-bold text-lg"
                            />
                            {!isManual && emi > 0 && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background px-1">
                                    Auto-calculated
                                </span>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full">Add Loan</Button>
                </form>
            </div>
        </div>
    );
}
