import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/Provider/ReduxProvider";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Smart Inventory | Dashboard",
    description: "Professional Inventory & Order Management System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${inter.variable} antialiased font-sans`}>
                <ReduxProvider>{children}</ReduxProvider>
            </body>
        </html>
    );
}

