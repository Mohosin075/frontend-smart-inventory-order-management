"use client";

import ResetPassword_Form from "@/components/forms/ResetPassword_Form";
import { Suspense } from "react";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 premium-sidebar relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
            />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[480px] z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-2xl mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/20">
                    <div className="p-10 md:p-14">
                        <Suspense fallback={<div className="text-center font-bold text-slate-400 py-20 uppercase tracking-widest animate-pulse">Initializing Identity Check...</div>}>
                            <ResetPassword_Form />
                        </Suspense>
                    </div>
                </div>

                <p className="mt-10 text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                    Secure Recovery Protocol v2.5
                </p>
            </motion.div>

            {/* Atmospheric blurs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default ResetPasswordPage;
