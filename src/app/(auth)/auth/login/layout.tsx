"use client";

import NonAuthenticatedGuard from "@/Provider/NonAuthenticatedGuard";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <NonAuthenticatedGuard>{children}</NonAuthenticatedGuard>;
}
