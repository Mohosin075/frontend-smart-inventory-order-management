import type { NextConfig } from "next";
import { URL } from "url";

const baseUrl = process.env.NEXT_PUBLIC_BASEURL;
const apiUrl = baseUrl ? new URL(baseUrl) : undefined;
const apiProtocol: "http" | "https" = apiUrl?.protocol === "https:" ? "https" : "http";
const apiHostname = apiUrl?.hostname;

const remotePatterns = [
    {
        protocol: "https",
        hostname: "buddi.script.s3.ap-southeast-1.amazonaws.com",
        pathname: "/image/**",
    },
    {
        protocol: "http",
        hostname: "buddi.script.s3.ap-southeast-1.amazonaws.com",
        pathname: "/image/**",
    },
    ...(apiHostname
        ? [
              {
                  protocol: apiProtocol,
                  hostname: apiHostname,
                  pathname: "/**",
              },
          ]
        : []),
    {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
    },
    {
        protocol: "https",
        hostname: "localhost",
        pathname: "/**",
    },
];

const nextConfig: NextConfig = {
    images: {
        remotePatterns: remotePatterns as NonNullable<NextConfig["images"]>["remotePatterns"],
        unoptimized: true,
    },
};

export default nextConfig;
