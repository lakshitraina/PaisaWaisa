import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Bell, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function NotificationDropdown() {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!currentUser) return;

        // Smart Alerts: Check for due EMIs
        const q = query(
            collection(db, "loans"),
            where("userId", "==", currentUser.uid),
            where("status", "==", "active")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const newNotifications = [];
            const today = new Date();

            loans.forEach(loan => {
                const dueDate = new Date(loan.nextDueDate.seconds * 1000);
                const diffTime = dueDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days remaining

                if (diffDays < 0) {
                    newNotifications.push({
                        id: `overdue-${loan.id}`,
                        title: "Overdue EMI Alert",
                        message: `EMI for ${loan.name} was due on ${dueDate.toLocaleDateString()}. Late penalties may apply.`,
                        type: "urgent",
                        time: "Now"
                    });
                } else if (diffDays <= 3) {
                    newNotifications.push({
                        id: `due-${loan.id}`,
                        title: "Upcoming EMI",
                        message: `EMI for ${loan.name} is due in ${diffDays} days. Pay now to maintain credit score.`,
                        type: "warning",
                        time: `${diffDays} days left`
                    });
                }
            });

            setNotifications(newNotifications);
            setUnreadCount(newNotifications.length);
        });

        return unsubscribe;
    }, [currentUser]);

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full relative" onClick={() => setIsOpen(!isOpen)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border border-background animate-pulse"></span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-popover shadow-lg animate-in fade-in zoom-in-95 z-50">
                    <div className="flex items-center justify-between p-3 border-b">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="xs" onClick={() => setUnreadCount(0)} className="h-auto py-1 px-2 text-[10px]">
                                Mark all read
                            </Button>
                        )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No new notifications
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className={`p-3 text-sm hover:bg-muted/50 transition-colors ${notif.type === 'urgent' ? 'bg-red-50/10' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-medium ${notif.type === 'urgent' ? 'text-red-500' : 'text-foreground'}`}>
                                                {notif.title}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                                        </div>
                                        <p className="text-muted-foreground text-xs leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Click outside closer overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
