import { useState, useEffect } from "react";

const QUOTES = [
    "Salary aayi? Gayi? Pata hi nahi chala! 💸",
    "Month end pe account balance dekh kar heart attack scene on! 📉",
    "Udhaar mangne waala tera muh kaala! 🚫",
    "Savings karna tha, momos kha liya. 🥟",
    "Paisa bolta hai: 'Aaj mujhe bacha lo, kal main tumhe bacha lunga!' 💰",
    "Credit card bill: The uninvited guest of the month. 💳",
    "Investment market subject to risk hai, par FD se better hai! 🚀",
    "Udhaar mangne waale se savdhaan, satark rahein! 🚫",
    "Budgeting is asking your money where it's going instead of wondering where it went. 🤔",
    "Ameer banne ka shauk hai, par kharcha karne ki aadat bhi! 🤷‍♂️",
    "SIP: Sahi Hai... jab tak market laal na ho! 📉",
    "Monday blues se bada dukh sirf Bank Balance dekhne ka hota hai. 😭",
    "Dost ki party mein contribution: ₹500. Ussi dost se udhaar wapis maangna: Mission Impossible. 🕵️‍♂️"
];

export default function FunnyQuoteCard() {
    const [quote, setQuote] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                let newQuote;
                do {
                    newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
                } while (newQuote === quote && QUOTES.length > 1);

                setQuote(newQuote);
                setIsVisible(true);
            }, 500);

        }, 5000);

        return () => clearInterval(interval);
    }, [quote]);

    return (
        <div className={`hidden md:flex flex-1 justify-center px-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm font-medium text-muted-foreground italic text-center bg-muted/30 px-3 py-1 rounded-full border border-border/50">
                ✨ {quote}
            </p>
        </div>
    );
}
