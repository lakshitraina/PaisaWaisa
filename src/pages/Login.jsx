import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/");
        } catch {
            setError("Failed to sign in. Please check your credentials.");
        }

        setLoading(false);
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground">Enter your credentials to access your account</p>
                </div>

                {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                </div>
            </Card>
        </div>
    );
}
