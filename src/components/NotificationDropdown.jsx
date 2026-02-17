import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export default function NotificationDropdown() {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(docs);
            setUnreadCount(docs.filter(n => !n.read).length);
        });

        return unsubscribe;
    }, [currentUser]);

    const markAsRead = async (id) => {
        try {
            await updateDoc(doc(db, "notifications", id), { read: true });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        unreadIds.forEach(id => markAsRead(id));
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
                )}
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <Card className="absolute right-0 mt-2 w-80 z-50 p-0 overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={markAllAsRead}
                                    className="h-6 text-xs text-primary"
                                >
                                    Mark all read
                                </Button>
                            )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No notifications
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 text-sm flex gap-3 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-primary/5" : ""}`}
                                            onClick={() => !notification.read && markAsRead(notification.id)}
                                        >
                                            <div className="mt-1">
                                                <div className={`h-2 w-2 rounded-full ${!notification.read ? "bg-primary" : "bg-transparent"}`} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="leading-snug">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(notification.createdAt?.toDate()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}
