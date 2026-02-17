import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, LogOut, Moon, Sun, Copy, Check, Edit2, Save, X } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        const fetchUserData = async () => {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
                setNewName(docSnap.data().name);
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleCopy = () => {
        if (userData?.inviteCode) {
            navigator.clipboard.writeText(userData.inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) return;
        try {
            await updateDoc(doc(db, "users", currentUser.uid), { name: newName });
            setUserData(prev => ({ ...prev, name: newName }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    return (
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center w-full">
                        {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                                <Input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="max-w-[200px]"
                                />
                                <Button size="icon" variant="ghost" onClick={handleUpdateName}>
                                    <Save className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                                    <X className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <h1 className="text-2xl font-bold">{userData?.name || "User"}</h1>
                                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <p className="text-muted-foreground">{currentUser?.email}</p>
                    </div>

                    {userData?.inviteCode && (
                        <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                            <span className="text-sm font-mono tracking-wider">code: {userData.inviteCode}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCopy}>
                                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-3">
                            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <span className="font-medium">Appearance</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={toggleTheme}>
                            {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </Button>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full gap-2"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </Card>
        </div>
    );
}
