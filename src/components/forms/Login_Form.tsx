"use client";

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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Image from "next/image";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must be less than 50 characters"),
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
        reset,
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
                dispatch(
                    setCredentials({
                        accessToken: response.data.accessToken,
                        role: response.data.role,
                    })
                );
                toast.success("Login successful!");
                router.push("/");
            } else {
                toast.error(response.message || "Login failed");
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            toast.error(error?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
            reset();
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm w-full max-w-[480px]">
            <form onSubmit={handleSubmit(handleLogin)} className="w-full">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                        <Image src="/logo.svg" alt="ASCELA" width={80} height={80} className="object-contain" />
                    </div>
                    <h1 className="text-xl text-center font-serif text-[#5A5A5A] tracking-wide">
                        Welcome back! Sign in to continue
                    </h1>
                </div>

                {/* Email Field */}
                <div className="mb-6 space-y-2">
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

                {/* Password Field */}
                <div className="mb-6 space-y-2">
                    <label className="block text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                    </label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            {...register("password")} 
                            placeholder="Enter your password" 
                            className="w-full px-4 py-3 border border-[#F48FB1]/30 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#F48FB1]/50 bg-white placeholder:text-gray-400 pr-10" 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="rememberMe" 
                            {...register("rememberMe")} 
                            className="h-4 w-4 rounded-full border-gray-300 text-[#F48FB1] focus:ring-[#F48FB1]" 
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm font-semibold text-[#5A5A5A]">
                            Remember me
                        </label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-[#F48FB1] text-sm font-medium hover:text-[#F06292] transition-colors">
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-[#F48FB1] hover:bg-[#F06292] text-white font-medium text-lg py-3 px-4 rounded-[12px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#F48FB1]/20"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>
        </div>
    );
}
