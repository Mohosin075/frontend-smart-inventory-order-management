"use client";

import { Eye, EyeOff, Mail, Lock, Loader2, Wand2, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login_Form() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "web.mohosin@gmail.com",
            password: "12345678",
            rememberMe: false,
        },
    });

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Logging in...");

        try {
            const response = await login(data).unwrap();
            if (response.success && response.data) {
                dispatch(setCredentials({
                    accessToken: response.data.accessToken,
                    role: response.data.role,
                }));
                toast.success("Welcome back!", { id: toastId });
                router.push("/");
            } else {
                toast.error(response.message || "Invalid email or password", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong. Please try again.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Accessing demo account...");
        try {
            const demoCreds = { email: "web.mohosin@gmail.com", password: "12345678", rememberMe: false };
            const response = await login(demoCreds).unwrap();
            if (response.success && response.data) {
                dispatch(setCredentials({
                    accessToken: response.data.accessToken,
                    role: response.data.role,
                }));
                toast.success("Welcome to the demo!", { id: toastId });
                router.push("/");
            }
        } catch (error: any) {
            toast.error("Demo login currently unavailable.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-10 text-left">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Welcome back</h2>
                <p className="text-slate-500 font-medium">Please enter your details to access your account.</p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="email" 
                            {...register("email")} 
                            placeholder="e.g. name@company.com" 
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none" 
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <Link href="/auth/forgot-password" title="Recover account" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            {...register("password")} 
                            placeholder="At least 6 characters" 
                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none" 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <input type="checkbox" {...register("rememberMe")} className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                        <span className="font-semibold text-slate-600 text-sm">Keep me logged in</span>
                    </label>
                </div>

                <div className="space-y-4 pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isLoading ? "Signing in..." : "Sign in to your account"}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                        className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Wand2 className="w-4 h-4 text-indigo-600" />
                        Explore with a demo account
                    </button>
                </div>

                <div className="pt-8 border-t border-slate-100 mt-8">
                    <p className="text-sm font-medium text-slate-500 text-center">
                        Don't have an account yet? 
                        <Link href="/auth/signup" className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 hover:underline">Get started for free</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
