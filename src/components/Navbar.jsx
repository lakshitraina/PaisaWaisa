import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { Moon, Sun, LogOut, PlusCircle, LayoutDashboard, UserCircle, Users, PieChart, Split, Bell, Menu, X, IndianRupee, ShieldCheck } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { BarChart3 } from "lucide-react";

import logoBlack from "../assets/Paisawaisafavblack.png";
import logoWhite from "../assets/Paisawaisafavblackwhite.png";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    {currentUser && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    )}

                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <img
                            src={theme === "dark" ? logoWhite : logoBlack}
                            alt="PaisaWaisa Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                {currentUser && (
                    <div className="hidden md:flex items-center gap-1 sm:gap-4 bg-muted/50 p-1 rounded-full border absolute left-1/2 -translate-x-1/2">
                        <Link to="/">
                            <Button variant={isActive("/") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Button>
                        </Link>
                        <Link to="/add-transaction">
                            <Button variant={isActive("/add-transaction") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <PlusCircle className="h-4 w-4" />
                                <span>Add</span>
                            </Button>
                        </Link>
                        <Link to="/family">
                            <Button variant={isActive("/family") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <Users className="h-4 w-4" />
                                <span>Family</span>
                            </Button>
                        </Link>
                        <Link to="/split">
                            <Button variant={isActive("/split") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <Split className="h-4 w-4" />
                                <span>Split</span>
                            </Button>
                        </Link>
                        <Link to="/loans">
                            <Button variant={isActive("/loans") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <IndianRupee className="h-4 w-4" />
                                <span>Loans</span>
                            </Button>
                        </Link>
                        <Link to="/credit-health">
                            <Button variant={isActive("/credit-health") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Credit</span>
                            </Button>
                        </Link>
                        <Link to="/insights">
                            <Button variant={isActive("/insights") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <PieChart className="h-4 w-4" />
                                <span>Insights</span>
                            </Button>
                        </Link>
                        <Link to="/profile">
                            <Button variant={isActive("/profile") ? "primary" : "ghost"} size="sm" className="rounded-full gap-2">
                                <UserCircle className="h-4 w-4" />
                                <span>Profile</span>
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {currentUser && <NotificationDropdown />}
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                        {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
                    </Button>

                    {currentUser ? (
                        <div className="flex items-center gap-2">
                            {/* Keep Logout visible or move to menu? Keeping it visible for easy access */}
                            <Button variant="outline" size="icon" className="rounded-full" onClick={logout} title="Logout">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                            <Link to="/signup"><Button size="sm">Get Started</Button></Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && currentUser && (
                <div className="md:hidden border-t bg-background p-4 space-y-2 animate-in slide-in-from-top-2">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Button>
                    </Link>
                    <Link to="/add-transaction" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/add-transaction") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <PlusCircle className="h-4 w-4" /> Add Transaction
                        </Button>
                    </Link>
                    <Link to="/family" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/family") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <Users className="h-4 w-4" /> Family Circle
                        </Button>
                    </Link>
                    <Link to="/split" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/split") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <Split className="h-4 w-4" /> Split Expenses
                        </Button>
                    </Link>
                    <Link to="/loans" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/loans") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <IndianRupee className="h-4 w-4" /> Loans
                        </Button>
                    </Link>
                    <Link to="/credit-health" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/credit-health") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <ShieldCheck className="h-4 w-4" /> Credit Health
                        </Button>
                    </Link>
                    <Link to="/insights" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/insights") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <PieChart className="h-4 w-4" /> Insights
                        </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant={isActive("/profile") ? "primary" : "ghost"} className="w-full justify-start gap-2">
                            <UserCircle className="h-4 w-4" /> Profile
                        </Button>
                    </Link>

                    <div className="pt-2 border-t mt-2">
                        <div className="flex items-center justify-between px-2 py-2">
                            <span className="text-sm font-medium text-muted-foreground">{currentUser.email}</span>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
