// export const getImageUrl = (imagePath: string | undefined | null): string => {
//     if (!imagePath) return "";
//     if (imagePath.startsWith("http")) {
//         return imagePath;
//     }
//     const baseUrl = process.env.NEXT_PUBLIC_BASEURL || "";
//     const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
//     return `${cleanBaseUrl}${imagePath}`;
// };

export const getImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) return "";

    if (imagePath.startsWith("https://")) {
        return imagePath.replace("https://", "http://");
    }

    if (imagePath.startsWith("http://")) {
        return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASEURL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}${imagePath}`;
};
