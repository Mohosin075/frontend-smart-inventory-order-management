"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { Mail, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

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
        const toastId = toast.loading("Sending reset link...");

        try {
            const response = await forgotPassword(data).unwrap();

            if (response.success) {
                toast.success(response.message || "Reset link sent successfully!");
                router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
            } else {
                toast.error(response.message || "Something went wrong");
            }
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(error?.data?.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-sm w-full max-w-[480px] relative">
            {/* Back Button */}
            <div className="absolute top-8 left-8">
                <Link href="/auth/login" className="flex items-center text-sm font-medium text-[#5A5A5A] hover:text-[#F48FB1] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                </Link>
            </div>

            <form onSubmit={handleSubmit(handleSubmitEmail)} className="w-full mt-8">
                {/* Icon & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-[#FDE8ED] rounded-full flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-[#F48FB1]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-serif text-[#F48FB1] text-center tracking-widest uppercase mb-3">
                        Forgot Password
                    </h1>
                    <p className="text-[#5A5A5A] text-center text-sm">
                        Enter your email to receive a verification code
                    </p>
                </div>

                {/* Email Field */}
                <div className="mb-8 space-y-2">
                    <label className="block text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        {...register("email")} 
                        placeholder="your@email.com" 
                        className="w-full px-4 py-3 border border-[#F48FB1]/30 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#F48FB1]/50 bg-white placeholder:text-gray-400" 
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-[#F48FB1] hover:bg-[#F06292] text-white font-medium text-lg py-3 px-4 rounded-[12px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#F48FB1]/20 mb-8"
                >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                </button>

                {/* Security Note */}
                <div className="bg-[#FFF8F9] rounded-[12px] p-4 flex items-start gap-3">
                    <Lock className="w-4 h-4 text-[#8D6E63] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#5A5A5A] leading-relaxed">
                        <span className="font-semibold text-[#4A4A4A]">Security Note:</span> We'll send a 6-digit verification code to your email address.
                    </p>
                </div>
            </form>
        </div>
    );
}
