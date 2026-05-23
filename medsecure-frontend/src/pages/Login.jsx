import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertCircle } from 'lucide-react';

function Login() {
    const { Login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email.trim()) return setError("Email is required") || false;
        if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address") || false;
        if (!password) return setError("Password is required") || false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const userData = await login({ username: email, password: password });
            Login(userData, navigate);
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <Card className="border-0 shadow-lg">
                    <CardHeader className="space-y-2 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription className="text-base">
                            Sign in to your MedSecure account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex gap-3 items-start">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    disabled={isLoading}
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    disabled={isLoading}
                                    className="h-10 rounded-lg"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p>
                                Don't have an account?{" "}
                                <a href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                                    Sign up here
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    © 2026 MedSecure. All rights reserved.
                </p>

            </div>
        </div>
    );
}

export default Login;