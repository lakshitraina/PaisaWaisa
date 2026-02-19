import { useMemo } from 'react';
import { Tooltip } from 'recharts';
import { getDateObject } from '../lib/utils';

export default function HeatmapCalendar({ transactions }) {
    const data = useMemo(() => {
        const map = {};
        transactions.forEach(t => {
            if (t.type === 'expense') {
                const dateObj = getDateObject(t.date);
                const date = dateObj ? dateObj.toISOString().split('T')[0] : null;
                if (date) {
                    map[date] = (map[date] || 0) + t.amount;
                }
            }
        });
        return map;
    }, [transactions]);

    // Generate array of weeks for the last year
    const weeks = useMemo(() => {
        const weeksArray = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);

        // Adjust start date to the nearest preceding Sunday
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        let currentDate = new Date(startDate);
        const endDate = new Date(today);

        // Generate roughly 53 weeks to cover the year
        for (let w = 0; w < 53; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const dateStr = currentDate.toISOString().split('T')[0];
                week.push({
                    date: dateStr,
                    val: data[dateStr] || 0,
                    inRange: currentDate <= endDate
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeksArray.push(week);
        }
        return weeksArray;
    }, [data]);

    const getColor = (amount) => {
        if (!amount) return "bg-muted/40"; // Lighter placeholder
        if (amount < 50) return "bg-green-200 dark:bg-green-900";
        if (amount < 200) return "bg-green-400 dark:bg-green-700";
        if (amount < 500) return "bg-green-600 dark:bg-green-500";
        return "bg-green-800 dark:bg-green-300";
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0"> {/* Scroll container with negative margins for full edge-to-edge effect on mobile if desired, or just simple scroll */}
                {/* Let's keep it simple and contained within the card padding for now, but ensure it scrolls */}
                <div className="min-w-[600px] flex gap-[2px]">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex-1 flex flex-col gap-[2px] min-w-[8px]">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={day.date}
                                    className={`w-full aspect-square rounded-[1px] md:rounded-sm ${day.inRange ? getColor(day.val) : 'bg-transparent'}`}
                                    title={day.inRange ? `${day.date}: ₹${day.val.toFixed(2)}` : ''}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 justify-end">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted/40" />
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
