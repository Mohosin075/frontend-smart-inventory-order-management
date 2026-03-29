"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignupMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup_Form() {
    const [isLoading, setIsLoading] = useState(false);
    const [signup] = useSignupMutation();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

    const handleSignup = async (data: SignupFormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Creating your account...");
        try {
            const payload = { name: data.name, email: data.email, password: data.password };
            const response = await signup(payload).unwrap();
            if (response.success) {
                toast.success("Registration successful! Please log in.", { id: toastId });
                router.push("/auth/login");
            } else {
                toast.error(response.message || "Registration failed", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong. Please try again.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-10 text-left">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Create your account</h2>
                <p className="text-slate-500 font-medium">Join us today to start managing your business efficiently.</p>
            </div>

            <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
                {/* Full Name Field */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        Full Name
                    </label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="text" 
                            {...register("name")} 
                            placeholder="e.g. John Doe" 
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none" 
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name.message}</p>
                    )}
                </div>

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

                {/* Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input 
                                type="password" 
                                {...register("password")} 
                                placeholder="••••••••" 
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none" 
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input 
                                type="password" 
                                {...register("confirmPassword")} 
                                placeholder="••••••••" 
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none" 
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isLoading ? "Creating account..." : "Register Now"}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                <div className="pt-8 border-t border-slate-100 mt-8 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        Already dynamic part of our system? 
                        <Link href="/auth/login" className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 hover:underline inline-flex items-center gap-1 group">
                            Log in here <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
