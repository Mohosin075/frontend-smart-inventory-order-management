"use client";

import ForgotPassword_Form from "@/components/forms/ForgotPassword_Form";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

const ForgotPasswordPage = () => {
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
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/20">
                    <div className="p-10 md:p-14">
                        <ForgotPassword_Form />
                    </div>
                </div>

                <p className="mt-10 text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
                    Secure Recovery Protocol v2.5
                </p>
            </motion.div>

            {/* Atmospheric blurs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default ForgotPasswordPage;
