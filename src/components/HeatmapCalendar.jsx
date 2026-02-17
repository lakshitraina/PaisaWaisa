import { useMemo } from 'react';
import { Tooltip } from 'recharts';

export default function HeatmapCalendar({ transactions }) {
    const data = useMemo(() => {
        const map = {};
        transactions.forEach(t => {
            if (t.type === 'expense') {
                const date = t.date?.toDate().toISOString().split('T')[0];
                if (date) {
                    map[date] = (map[date] || 0) + t.amount;
                }
            }
        });
        return map;
    }, [transactions]);

    const today = new Date();
    const dates = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const getColor = (amount) => {
        if (!amount) return "bg-muted";
        if (amount < 50) return "bg-green-200 dark:bg-green-900";
        if (amount < 200) return "bg-green-400 dark:bg-green-700";
        if (amount < 500) return "bg-green-600 dark:bg-green-500";
        return "bg-green-800 dark:bg-green-300";
    };

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex gap-1" style={{ width: "max-content" }}>
                {dates.map((date) => (
                    <div
                        key={date}
                        className={`w-3 h-3 rounded-sm ${getColor(data[date])}`}
                        title={`${date}: ₹${data[date]?.toFixed(2) || 0}`}
                    />
                ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted" />
                    <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
                    <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
                    <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
                    <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
