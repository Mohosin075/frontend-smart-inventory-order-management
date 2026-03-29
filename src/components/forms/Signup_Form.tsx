"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignupMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
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
        reset,
    } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

    const handleSignup = async (data: SignupFormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setIsLoading(true);
        const toastId = toast.loading("Creating account...");
        try {
            const payload = { name: data.name, email: data.email, password: data.password };
            const response = await signup(payload).unwrap();
            if (response.success) {
                toast.success("Account created. Please login.");
                router.push("/auth/login");
            } else {
                toast.error(response.message || "Signup failed");
            }
        } catch (error: any) {
            console.error("Signup failed:", error);
            toast.error(error?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
            reset();
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm w-full max-w-[520px]">
            <form onSubmit={handleSubmit(handleSignup)} className="w-full">
                <h2 className="text-xl mb-6 font-semibold">Create an account</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input {...register("name")} className="w-full px-4 py-3 border rounded-md" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input {...register("email")} className="w-full px-4 py-3 border rounded-md" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input type="password" {...register("password")} className="w-full px-4 py-3 border rounded-md" />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <input type="password" {...register("confirmPassword")} className="w-full px-4 py-3 border rounded-md" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-[#4F46E5] text-white py-3 rounded-md">
                    {isLoading ? "Creating..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}
