import Link from "next/link";
import { Home } from "lucide-react";

export default function Simple404() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
            <div className="text-center max-w-md">
                {/* 404 Number */}
                <div className="mb-6">
                    <span className="text-8xl font-black text-[#412667]">4</span>
                    <span className="text-8xl font-black text-[#1AA367]">0</span>
                    <span className="text-8xl font-black text-[#67E9F1]">4</span>
                </div>

                {/* Message */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
                <p className="text-gray-600 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

                {/* Back to Home Button */}
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#412667] text-white font-medium rounded-lg hover:bg-[#351A54] transition-colors">
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>

                {/* Color dots at bottom */}
                <div className="flex justify-center gap-3 mt-12">
                    <div className="w-3 h-3 rounded-full bg-[#412667]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#1AA367]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#67E9F1]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#24E795]"></div>
                </div>
            </div>
        </div>
    );
}
