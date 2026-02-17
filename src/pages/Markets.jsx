import { useState, useEffect } from "react";
import { MarketCard } from "../components/MarketCard";
import { RefreshCw, BarChart3 } from "lucide-react";
import { Button } from "../components/ui/Button";

// Yahoo Finance Symbols:
// NIFTY 50 -> ^NSEI
// SENSEX -> ^BSESN
// BANK NIFTY -> ^NSEBANK
// Gold -> GC=F
// Silver -> SI=F
// USD/INR -> INR=X

const SYMBOLS = [
    { id: 1, name: "NIFTY 50", symbol: "^NSEI", displaySymbol: "NIFTY", isCurrency: false },
    { id: 2, name: "SENSEX", symbol: "^BSESN", displaySymbol: "SENSEX", isCurrency: false },
    { id: 3, name: "BANK NIFTY", symbol: "^NSEBANK", displaySymbol: "BANKNIFTY", isCurrency: false },
    { id: 4, name: "Gold", symbol: "GC=F", displaySymbol: "GOLD", isCurrency: true, isCommodity: true }, // Gold futures often in USD
    { id: 5, name: "Silver", symbol: "SI=F", displaySymbol: "SILVER", isCurrency: true, isCommodity: true },
    { id: 6, name: "USD to INR", symbol: "INR=X", displaySymbol: "USD/INR", isCurrency: true },
];

export default function Markets() {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchMarketData = async () => {
        setLoading(true);
        try {
            const promises = SYMBOLS.map(async (item) => {
                try {
                    // Try using api.allorigins.win in 'get' mode which returns JSON with 'contents' string
                    // This is more reliable for client-side scraping
                    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?interval=1d&range=1d`;
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

                    const response = await fetch(proxyUrl);
                    if (!response.ok) throw new Error('Network response was not ok');

                    const wrapperData = await response.json();
                    if (!wrapperData.contents) throw new Error('No content in proxy response');

                    const data = JSON.parse(wrapperData.contents);
                    const result = data.chart.result[0];
                    const meta = result.meta;

                    const price = meta.regularMarketPrice;
                    const prevClose = meta.previousClose;
                    const changeAmount = price - prevClose;
                    const changePercent = (changeAmount / prevClose) * 100;

                    return {
                        id: item.id,
                        name: item.name,
                        symbol: item.displaySymbol,
                        price: price,
                        change: changePercent,
                        changeAmount: changeAmount,
                        isCurrency: item.isCurrency,
                        lastUpdated: new Date()
                    };
                } catch (err) {
                    console.warn(`Failed to fetch ${item.name} with proxy, falling back to simulation`, err);

                    // Dynamic Simulation Fallback:
                    // Create a realistic looking price based on the "base" price + random flux
                    const bases = {
                        'NIFTY': 22500, 'SENSEX': 74000, 'BANKNIFTY': 48000,
                        'GOLD': 65000, 'SILVER': 75000, 'USD/INR': 83.50
                    };
                    const basePrice = bases[item.displaySymbol] || 1000;
                    const volatility = item.isCurrency ? 0.05 : 0.8;
                    const randomFlux = (Math.random() - 0.5) * volatility;
                    const simPrice = basePrice * (1 + randomFlux / 100);
                    const simChange = randomFlux;
                    const simChangeAmt = simPrice - basePrice;

                    return {
                        id: item.id,
                        name: item.name,
                        symbol: item.displaySymbol,
                        price: simPrice,
                        change: simChange,
                        changeAmount: simChangeAmt,
                        isCurrency: item.isCurrency,
                        lastUpdated: new Date(),
                        isSimulated: true
                    };
                }
            });

            const results = await Promise.all(promises);
            const validResults = results.filter(r => r !== null);

            if (validResults.length > 0) {
                setMarkets(validResults);
            }
            setLastRefresh(new Date());
        } catch (error) {
            console.error("Error fetching market data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();

        // Refresh every 60 seconds (Yahoo data is delayed anyway, no need for sub-second polling)
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-4 space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BarChart3 className="h-8 w-8 text-primary" />
                        Markets
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Live market indices and commodities tracker
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden md:inline-block">
                        Real-time Data (Delayed)
                    </span>
                    <Button variant="outline" size="sm" onClick={fetchMarketData} disabled={loading} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {loading && markets.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">Fetching market data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {markets.map(market => (
                        <MarketCard key={market.id} market={market} />
                    ))}
                </div>
            )}

            <div className="text-xs text-center text-muted-foreground mt-8">
                * Data sourced from Yahoo Finance where possible. Fallback simulation used if connection fails.
            </div>
        </div>
    );
}
