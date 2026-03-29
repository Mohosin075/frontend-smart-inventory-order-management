"use client";

import React, { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    const email = searchParams.get("email") || "your email";
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(59);

    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp1: "",
            otp2: "",
            otp3: "",
            otp4: "",
            otp5: "",
            otp6: "",
        },
    });

    // Use useWatch instead of watch
    const otpValues = useWatch({
        control,
        defaultValue: {
            otp1: "",
            otp2: "",
            otp3: "",
            otp4: "",
            otp5: "",
            otp6: "",
        },
    });

    const handleSubmitOTP = async (data: OTPFormData) => {
        setIsLoading(true);
        const otp = Object.values(data).join("");
        console.log("OTP submitted:", otp);
        // Simulate verification
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        router.push("/auth/reset-password");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const fieldName = `otp${index + 1}` as keyof OTPFormData;

        // If user pastes 6 digits
        if (value.length === 6 && /^\d+$/.test(value)) {
            const digits = value.split("");
            digits.forEach((digit, i) => {
                const digitFieldName = `otp${i + 1}` as keyof OTPFormData;
                setValue(digitFieldName, digit, { shouldValidate: true });
                if (inputRefs[i].current) {
                    inputRefs[i].current!.value = digit;
                }
            });
            inputRefs[5].current?.focus();
            return;
        }

        // Handle single digit input
        if (value.length === 1 && /^\d$/.test(value)) {
            setValue(fieldName, value, { shouldValidate: true });

            // Move to next input
            if (index < 5 && value) {
                setTimeout(() => {
                    inputRefs[index + 1].current?.focus();
                }, 0);
            }
        } else if (value.length === 0) {
            // Handle backspace
            setValue(fieldName, "", { shouldValidate: true });
        } else {
            // Clear if invalid input
            setValue(fieldName, "", { shouldValidate: true });
            e.target.value = "";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-sm w-full max-w-[480px] relative">
            {/* Back Button */}
            <div className="absolute top-8 left-8">
                <Link href="/auth/forgot-password" className="flex items-center text-sm font-medium text-[#5A5A5A] hover:text-[#F48FB1] transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Link>
            </div>

            <form onSubmit={handleSubmit(handleSubmitOTP)} className="w-full mt-8">
                {/* Icon & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-[#FDE8ED] rounded-full flex items-center justify-center mb-6">
                        <Mail className="w-8 h-8 text-[#F48FB1]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-serif text-[#F48FB1] text-center tracking-widest uppercase mb-3">
                        VERIFY CODE
                    </h1>
                    <p className="text-[#5A5A5A] text-center text-sm mb-1">
                        Enter the 6-digit code sent to
                    </p>
                    <p className="text-[#F48FB1] text-center text-sm font-medium">
                        {email}
                    </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-between gap-2 mb-8">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={inputRefs[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-14 border border-[#F48FB1]/30 rounded-[12px] text-center text-xl font-bold text-[#F48FB1] focus:outline-none focus:ring-2 focus:ring-[#F48FB1]/50 bg-white"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-[#F48FB1] hover:bg-[#F06292] text-white font-medium text-lg py-3 px-4 rounded-[12px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#F48FB1]/20 mb-6"
                >
                    {isLoading ? "Verifying..." : "Verify Code"}
                </button>

                {/* Resend Timer */}
                <div className="text-center mb-8">
                    <p className="text-[#5A5A5A] text-sm">
                        Resend code in <span className="font-bold text-gray-800">{countdown}s</span>
                    </p>
                </div>

                {/* Help Section */}
                <div className="bg-[#FFF8F9] rounded-[12px] p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-[#8D6E63]" />
                        <span className="font-bold text-sm text-[#4A4A4A]">Didn't receive the code?</span>
                    </div>
                    <ul className="text-xs text-[#5A5A5A] space-y-1 list-disc list-inside pl-1">
                        <li>Check your spam or junk folder</li>
                        <li>Wait a few moments and check again</li>
                        <li>Click "Resend" after timer expires</li>
                    </ul>
                </div>
            </form>
        </div>
    );
}
