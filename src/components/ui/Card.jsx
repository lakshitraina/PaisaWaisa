import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
    return (
        <div
            className={cn(
                "rounded-xl border bg-card text-card-foreground shadow-sm",
                className
            )}
            {...props}
        />
    );
}
