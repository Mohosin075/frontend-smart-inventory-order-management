"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must be less than 50 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetPassword] = useResetPasswordMutation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const handleResetPassword = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Updating your password...");

        try {
            const response = await resetPassword(data).unwrap();
            if (response.success) {
                toast.success("Password updated successfully!", { id: toastId });
                router.push("/auth/login");
            } else {
                toast.error(response.message || "Failed to update password", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Internal system error. Please try again.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Set new password</h2>
                <p className="text-slate-500 font-medium px-4">Ensure your account is secure with a strong and unique password.</p>
            </div>

            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
                {/* New Password Field */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        New Password
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            {...register("newPassword")} 
                            placeholder="At least 6 characters" 
                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none" 
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.newPassword.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        Confirm New Password
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            {...register("confirmPassword")} 
                            placeholder="Please verify your password" 
                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none" 
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Password Requirements */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Security Check</span>
                    </div>
                    <ul className="text-xs text-slate-400 font-medium space-y-1 list-disc list-inside">
                        <li>Minimum 6 characters long</li>
                        <li>Must match perfectly with confirmation</li>
                    </ul>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isLoading ? "Updating..." : "Verify and update password"}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function ResetPassword_Form() {
    return (
        <Suspense fallback={<div className="text-center font-bold text-slate-400 py-10 uppercase tracking-widest animate-pulse">Loading Identity Context...</div>}>
            <ResetPasswordFormContent />
        </Suspense>
    );
}
