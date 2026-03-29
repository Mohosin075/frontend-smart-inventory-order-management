"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, ShieldCheck, Loader2, RefreshCcw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const otpSchema = z.object({
    otp1: z.string().length(1, "Required"),
    otp2: z.string().length(1, "Required"),
    otp3: z.string().length(1, "Required"),
    otp4: z.string().length(1, "Required"),
    otp5: z.string().length(1, "Required"),
    otp6: z.string().length(1, "Required"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function OTPVerify_Form() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "your email address";
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(59);

    const inputRefs = [
        useRef<HTMLInputElement>(null), 
        useRef<HTMLInputElement>(null), 
        useRef<HTMLInputElement>(null), 
        useRef<HTMLInputElement>(null), 
        useRef<HTMLInputElement>(null), 
        useRef<HTMLInputElement>(null)
    ];

    useEffect(() => {
        const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
        return () => { if (timer) clearInterval(timer); };
    }, [countdown]);

    const {
        control,
        handleSubmit,
        setValue,
    } = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp1: "", otp2: "", otp3: "", otp4: "", otp5: "", otp6: "",
        },
    });

    const handleSubmitOTP = async (data: OTPFormData) => {
        setIsLoading(true);
        const otp = Object.values(data).join("");
        // Simulate verification delay for realism
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setIsLoading(false);
        router.push("/auth/reset-password");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const fieldName = `otp${index + 1}` as keyof OTPFormData;

        if (value.length === 6 && /^\d+$/.test(value)) {
            const digits = value.split("");
            digits.forEach((digit, i) => {
                const digitFieldName = `otp${i + 1}` as keyof OTPFormData;
                setValue(digitFieldName, digit);
                if (inputRefs[i].current) inputRefs[i].current!.value = digit;
            });
            inputRefs[5].current?.focus();
            return;
        }

        if (value.length === 1 && /^\d$/.test(value)) {
            setValue(fieldName, value);
            if (index < 5) inputRefs[index + 1].current?.focus();
        } else {
            setValue(fieldName, "");
            e.target.value = "";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div className="w-full">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Check your email</h2>
                <p className="text-slate-500 font-medium px-4">We've sent a 6-digit confirmation code to</p>
                <p className="text-indigo-600 font-bold mt-1 lowercase truncate px-4">{email}</p>
            </div>

            <form onSubmit={handleSubmit(handleSubmitOTP)} className="space-y-8">
                {/* OTP Input Grid */}
                <div className="flex justify-between gap-3 px-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={inputRefs[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-600 transition-all outline-none shadow-sm"
                        />
                    ))}
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isLoading ? "Verifying code..." : "Verify and continue"}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                {/* Resend Logic */}
                <div className="text-center pt-2">
                    {countdown > 0 ? (
                        <p className="text-sm font-medium text-slate-500">
                            Resend code in <span className="text-slate-900 font-bold ml-1">{countdown}s</span>
                        </p>
                    ) : (
                        <button type="button" onClick={() => setCountdown(59)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mx-auto transition-colors group">
                            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            Didn't receive the code? Resend
                        </button>
                    )}
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                    <Link href="/auth/forgot-password" className="flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to forgot password
                    </Link>
                </div>
            </form>
        </div>
    );
}
