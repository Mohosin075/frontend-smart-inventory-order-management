"use client";

import Signup_Form from "@/components/forms/Signup_Form";
import { Layers, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const SignupPage = () => {
    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* Left Side: Branding & Value Prop */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:w-[55%] xl:w-[60%] hidden lg:flex flex-col justify-between p-16 premium-sidebar relative overflow-hidden"
            >
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
                />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-20">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-2xl">
                            <Layers className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-widest leading-none">Smart <span className="text-indigo-400">Inventory</span></h1>
                    </div>

                    <div className="max-w-xl">
                        <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-8">
                            Empowering Your Business with <span className="text-indigo-400 italic">Intelligent Logistics.</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                            Join thousands of professional operations who rely on Smart Inventory for their daily supply chain success.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {[
                                { title: "Stock Reliability", sub: "Never miss a restock opportunity again" },
                                { title: "Order Precision", sub: "Deliver exactly what was promised" },
                                { title: "Automated Insights", sub: "Analyze patterns with smart reporting" },
                                { title: "Multi-Team Access", sub: "Collaborate across your enterprise" }
                            ].map((feature, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    key={i} 
                                    className="space-y-2"
                                >
                                    <div className="flex items-center gap-3 text-white font-bold tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <span>{feature.title}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium pl-4.5">{feature.sub}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl max-w-sm">
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                                ))}
                            </div>
                            <p className="text-sm text-slate-300 font-medium italic mb-4 leading-relaxed">
                                "The transition to Smart Inventory was seamless. Our entire team now stays synchronized without manual spreadsheets."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20" />
                                <div>
                                    <div className="text-xs font-bold text-white">James Harrison</div>
                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Supply Manager, TechCorp</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                    <span>© {new Date().getFullYear()} Smart Inventory</span>
                    <div className="flex gap-8">
                        <span className="hover:text-white cursor-pointer transition-colors">Support</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Enterprise</span>
                    </div>
                </div>
                
                {/* Atmospheric blurs */}
                <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            </motion.div>

            {/* Right Side: Signup Form */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 xl:p-24 bg-white"
            >
                <div className="w-full max-w-[440px]">
                    {/* Logo for Mobile */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <Layers className="w-8 h-8 text-indigo-600" />
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Smart Inventory</span>
                    </div>

                    <Signup_Form />
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
