import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { Moon, Sun, LogOut, PlusCircle, LayoutDashboard, UserCircle, Users, PieChart, Split, Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        P
                    </div>
                    <span className="hidden sm:inline-block">PaisaWaisa</span>
                </Link>

                {currentUser && (
                    <div className="flex items-center gap-1 sm:gap-4 bg-muted/50 p-1 rounded-full border">
                        <Link to="/">
                            <Button
                                variant={isActive("/") ? "primary" : "ghost"}
                                size="sm"
                                className="rounded-full gap-2"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Button>
                        </Link>
                        <Link to="/add-transaction">
                            <Button
                                variant={isActive("/add-transaction") ? "primary" : "ghost"}
                                size="sm"
                                className="rounded-full gap-2"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Add</span>
                            </Button>
                        </Link>
                        <Link to="/family">
                            <Button
                                variant={isActive("/family") ? "primary" : "ghost"}
                                size="sm"
                                className="rounded-full gap-2"
                            >
                                <Users className="h-4 w-4" />
                                <span className="hidden lg:inline">Family</span>
                            </Button>
                        </Link>
                        <Link to="/split">
                            <Button
                                variant={isActive("/split") ? "primary" : "ghost"}
                                size="sm"
                                className="rounded-full gap-2"
                            >
                                <Split className="h-4 w-4" />
                                <span className="hidden lg:inline">Split</span>
                            </Button>
                        </Link>
                        <Link to="/insights">
                            <Button
                                variant={isActive("/insights") ? "primary" : "ghost"}
                                size="sm"
                                className="rounded-full gap-2"
                            >
                                <PieChart className="h-4 w-4" />
                                <span className="hidden lg:inline">Insights</span>
                            </Button>
                        </Link>
                        <Link to="/profile">
                            <Button
                                variant={isActive("/profile") ? "primary" : "ghost"}
                                size="sm"
                                className="rounded-full gap-2"
                            >
                                <UserCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {currentUser && <NotificationDropdown />}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <Moon className="h-5 w-5 text-slate-700" />
                        )}
                    </Button>

                    {currentUser ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-xs font-medium">{currentUser.email}</span>
                            </div>
                            <Button variant="outline" size="icon" className="rounded-full" onClick={logout} title="Logout">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
