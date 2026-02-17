import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { User, LogOut, Moon, Sun } from "lucide-react";

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">My Profile</h1>
                        <p className="text-muted-foreground">{currentUser?.email}</p>
                    </div>
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
