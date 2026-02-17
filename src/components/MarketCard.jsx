import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Card } from "./ui/Card";

export function MarketCard({ market }) {
    const isPositive = market.change >= 0;

    return (
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className={`absolute top-0 left-0 w-1 h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />

            <div className="p-5 pl-7">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">{market.name}</h3>
                        <p className="text-xs text-muted-foreground uppercase">{market.symbol}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(market.change).toFixed(2)}%
                    </div>
                </div>

                <div className="mt-4">
                    <div className="text-2xl font-bold tracking-tight">
                        {market.isCurrency ? '₹' : ''}{market.price.toLocaleString()}
                        {market.symbol === 'USD/INR' && !market.isCurrency ? '' : ''}
                    </div>
                    <div className={`text-sm mt-1 flex items-center gap-2 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span>{isPositive ? '+' : ''}{market.changeAmount.toFixed(2)}</span>
                        <span className="text-muted-foreground text-xs">• Today</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {market.lastUpdated?.toLocaleTimeString()}
                    </div>
                    <div className="font-medium">
                        Live 🟢
                    </div>
                </div>
            </div>

            {/* Simple sparkline decoration */}
            <div className="absolute bottom-0 right-0 w-24 h-12 opacity-10">
                <svg viewBox="0 0 100 50" className={`w-full h-full fill-current ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    <path d={isPositive ? "M0 50 L20 40 L40 45 L60 30 L80 35 L100 10 V50 Z" : "M0 50 L20 40 L40 45 L60 60 L80 70 L100 90 V50 Z"} />
                </svg>
            </div>
        </Card>
    );
}
