"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { Mail, ArrowLeft, Lock, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword_Form() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const handleSubmitEmail = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Sending recovery code...");

        try {
            const response = await forgotPassword(data).unwrap();
            if (response.success) {
                toast.success("Recovery code sent successfully!", { id: toastId });
                router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
            } else {
                toast.error(response.message || "Failed to send code", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Internal system error", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Reset your password</h2>
                <p className="text-slate-500 font-medium px-4">Enter your email and we'll send you a 6-digit code to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit(handleSubmitEmail)} className="space-y-6">
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

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isLoading ? "Sending code..." : "Send recovery code"}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                    <Link href="/auth/login" className="flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}
