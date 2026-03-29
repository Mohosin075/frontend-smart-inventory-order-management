"use client";
import { Layers } from "lucide-react";
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

    const handleDemoLogin = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Logging in with demo credentials...");
        try {
            const demoCreds = { email: "web.mohosin@gmail.com", password: "12345678", rememberMe: false };
            const response = await login(demoCreds).unwrap();
            if (response.success && response.data) {
                dispatch(
                    setCredentials({
                        accessToken: response.data.accessToken,
                        role: response.data.role,
                    })
                );
                toast.success("Demo login successful!");
                router.push("/");
            } else {
                toast.error(response.message || "Demo login failed");
            }
        } catch (error: any) {
            console.error("Demo login failed:", error);
            toast.error(error?.data?.message || "Demo login failed");
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm w-full max-w-[480px]">
            <form onSubmit={handleSubmit(handleLogin)} className="w-full">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                        <Image src="/logo.svg" alt="Smart Inventory" width={80} height={80} className="object-contain" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight underline decoration-indigo-200">SMART</h1>
                    </div>
                    <p className="text-sm text-center font-medium text-gray-500 uppercase tracking-widest italic">
                        Inventory Dashboard
                    </p>
                </div>

                {/* Email Field */}
                <div className="mb-6 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        {...register("email")} 
                        placeholder="your@email.com" 
                        className="w-full px-4 py-3 border border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all placeholder:text-gray-400" 
                    />
                    {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-6 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <Lock className="w-3.5 h-3.5 text-indigo-500" />
                        Password
                    </label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            {...register("password")} 
                            placeholder="Enter your password" 
                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all placeholder:text-gray-400 pr-10" 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs font-medium mt-1">{errors.password.message}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="rememberMe" 
                            {...register("rememberMe")} 
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Remember me
                        </label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-indigo-600 text-xs font-bold uppercase tracking-wide hover:text-indigo-800 transition-colors">
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-widest py-4 px-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-100 hover:shadow-indigo-200"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>

                <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="w-full mt-3 border-2 border-indigo-100 text-indigo-600 font-bold text-xs uppercase tracking-widest py-4 px-4 rounded-xl transition-all duration-200 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Working..." : "Demo Login"}
                </button>

            </form>
        </div>
    );
}
