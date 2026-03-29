"use client";

import { Layers, Eye, EyeOff, Mail, Lock, Sparkles, Wand2 } from "lucide-react";
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
        const toastId = toast.loading("Securely authorizing...");

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
                toast.error(response.message || "Invalid credentials", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Authentication failed", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Initializing demo environment...");
        try {
            const demoCreds = { email: "web.mohosin@gmail.com", password: "12345678", rememberMe: false };
            const response = await login(demoCreds).unwrap();
            if (response.success && response.data) {
                dispatch(setCredentials({
                    accessToken: response.data.accessToken,
                    role: response.data.role,
                }));
                toast.success("Logged in as Demo Admin", { id: toastId });
                router.push("/");
            }
        } catch (error: any) {
            toast.error("Demo access currently unavailable", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[500px]"
        >
            <div className="glass-card p-10 md:p-12 rounded-[3.5rem] premium-shadow border-none">
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center">
                        <motion.div 
                            whileHover={{ rotate: 180 }}
                            className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-6"
                        >
                            <Layers className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access <span className="premium-gradient-text">Portal</span></h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Smart Inventory Systems</p>
                    </div>

                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <Mail className="w-3.5 h-3.5" /> Identity
                            </label>
                            <input 
                                type="email" 
                                {...register("email")} 
                                placeholder="name@domain.com" 
                                className="w-full px-6 py-4.5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-300" 
                            />
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 ml-1"
                                    >
                                        {errors.email.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <Lock className="w-3.5 h-3.5" /> Credentials
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    {...register("password")} 
                                    placeholder="••••••••" 
                                    className="w-full px-6 py-4.5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-300 pr-14" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 ml-1"
                                    >
                                        {errors.password.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" {...register("rememberMe")} className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                            <span className="font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest text-[10px]">Persistent</span>
                        </label>
                        <Link href="/auth/forgot-password" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest text-[10px]">Recovery</Link>
                    </div>

                    <div className="space-y-3 pt-4">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            {isLoading ? "Validating..." : "Authorize Access"}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(99, 102, 241, 0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleDemoLogin}
                            disabled={isLoading}
                            className="w-full py-5 border-2 border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] transition-all flex items-center justify-center gap-2"
                        >
                            <Wand2 className="w-4 h-4" />
                            {isLoading ? "Working..." : "Demo Environment"}
                        </motion.button>
                    </div>

                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">
                        Nexus Systems Management v2.4
                    </p>
                </form>
            </div>
        </motion.div>
    );
}

