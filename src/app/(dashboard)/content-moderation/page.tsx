// "use client";

// import { useState, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { mockReports } from "@/data/demoContent";
// import ReviewReportedContent from "@/components/dashboard/content/ContentReviewModal";
// import { SidebarTrigger } from "@/components/ui/sidebar";

// const ITEMS_PER_PAGE = 10;

// export default function ModerationPage() {
//     const [currentPage, setCurrentPage] = useState(1);

//     // Calculate pagination
//     const totalPages = Math.ceil(mockReports.length / ITEMS_PER_PAGE);
//     const paginatedReports = useMemo(() => {
//         const start = (currentPage - 1) * ITEMS_PER_PAGE;
//         return mockReports.slice(start, start + ITEMS_PER_PAGE);
//     }, [currentPage]);

//     const pageNumbers = useMemo(() => {
//         const pages = [];
//         for (let i = 1; i <= totalPages; i++) {
//             pages.push(i);
//         }
//         return pages;
//     }, [totalPages]);

//     const handlePageChange = (page: number) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
//     };

//     return (
//         <main className="flex flex-col gap-8">
//             {/* Header */}
//             <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                     <SidebarTrigger className="md:hidden block" />
//                     <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
//                 </div>
//                 <p className="text-[#4D5999]">Review and moderate reported content</p>
//             </div>

//             {/* Moderation Metrics */}
//             <div>
//                 <h2 className="mb-4 text-2xl font-bold">Moderation Metrics</h2>
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                     {/* Pending Reports */}
//                     <div className="border border-[#CFD4E8] rounded-md p-4">
//                         <div className="pb-2">
//                             <h3 className="font-medium text-[#0D0F1C]">Pending Reports</h3>
//                         </div>
//                         <div className="text-2xl font-bold">2</div>
//                     </div>

//                     {/* Resolved */}
//                     <div className="border border-[#CFD4E8] rounded-md p-4">
//                         <div className="pb-2">
//                             <h3 className="font-medium text-[#0D0F1C]">Resolved</h3>
//                         </div>
//                         <div className="text-2xl font-bold">2</div>
//                     </div>

//                     {/* Dismissed */}
//                     <div className="border border-[#CFD4E8] rounded-md p-4">
//                         <div className="pb-2">
//                             <h3 className="font-medium text-[#0D0F1C]">Dismissed</h3>
//                         </div>
//                         <div className="text-2xl font-bold">10</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Report Queue */}
//             <div>
//                 <h2 className="mb-4 text-xl font-semibold">Report Queue</h2>
//                 <Card className="p-0">
//                     <CardContent className="p-0">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Report ID</TableHead>
//                                     <TableHead>Content Type</TableHead>
//                                     <TableHead>Reported By</TableHead>
//                                     <TableHead>Reported Content</TableHead>
//                                     <TableHead>Reason</TableHead>
//                                     <TableHead>Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {paginatedReports.map((report) => (
//                                     <TableRow key={report.id} className="text-[#4D5999]">
//                                         <TableCell className="font-medium ">#{report.reportId}</TableCell>
//                                         <TableCell>{report.contentType}</TableCell>
//                                         <TableCell>{report.reportedBy}</TableCell>
//                                         <TableCell>{report.reportedContent}</TableCell>
//                                         <TableCell>{report.reason}</TableCell>
//                                         {/* <TableCell>
//                                             <Button variant="ghost" size="sm" className="text-[#4D5999] hover:text-[#4D5999] cursor-pointer">
//                                                 Review
//                                             </Button>
//                                         </TableCell> */}
//                                         <ReviewReportedContent></ReviewReportedContent>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Pagination */}
//             <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                 <div className="text-sm text-muted-foreground">
//                     Showing {paginatedReports.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, mockReports.length)} of {mockReports.length} reports
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                     <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//                         Previous
//                     </Button>
//                     {pageNumbers.map((page) => (
//                         <Button key={page} variant={currentPage === page ? "default" : "outline"} onClick={() => handlePageChange(page)} className={`w-10 h-10 ${currentPage === page ? "bg-[#5C22BF] text-white border-[#5C22BF]" : ""}`}>
//                             {page}
//                         </Button>
//                     ))}
//                     <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         </main>
//     );
// }

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ReviewReportedContent from "@/components/dashboard/content/ContentReviewModal";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetSupportsQuery } from "@/redux/features/support/supportApi";
import { format } from "date-fns";

// Interface for API support data
interface ApiSupport {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    contentType: string;
    reason: string;
    message: string;
    status: string;
    attachments: any[];
    createdAt: string;
    updatedAt: string;
}

// Local support interface for UI
interface LocalSupport {
    id: string;
    reportId: string;
    contentType: string;
    reportedBy: string;
    reportedContent: string;
    reason: string;
    status: string;
    userId: string;
    userEmail: string;
    createdAt: string;
    message: string;
}

// Convert API support to local support format
const convertApiSupportToLocal = (apiSupport: ApiSupport): LocalSupport => {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch {
            return "N/A";
        }
    };

    return {
        id: apiSupport._id,
        reportId: `#${apiSupport._id.slice(-6).toUpperCase()}`,
        contentType: apiSupport.contentType || "other",
        reportedBy: apiSupport.userId?.name || "Unknown User",
        reportedContent: apiSupport.message?.substring(0, 50) + (apiSupport.message?.length > 50 ? "..." : "") || "No message",
        reason: apiSupport.reason || "other",
        status: apiSupport.status || "pending",
        userId: apiSupport.userId?._id,
        userEmail: apiSupport.userId?.email,
        createdAt: formatDate(apiSupport.createdAt),
        message: apiSupport.message || "No message provided",
    };
};

// Get content type display name
const getContentTypeDisplayName = (contentType: string): string => {
    const contentTypeMap: Record<string, string> = {
        comment: "Comment",
        event: "Event",
        user: "User",
        payment: "Payment",
        technical: "Technical",
        other: "Other",
    };
    return contentTypeMap[contentType] || contentType;
};

// Get reason display name
const getReasonDisplayName = (reason: string): string => {
    const reasonMap: Record<string, string> = {
        spam: "Spam",
        harassment: "Harassment",
        inappropriate: "Inappropriate",
        copyright: "Copyright",
        privacy: "Privacy",
        technical: "Technical",
        other: "Other",
    };
    return reasonMap[reason] || reason;
};

export default function ModerationPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // RTK Query hooks - only using get, modal handles updates/deletes
    const {
        data: supportsData,
        isLoading,
        isError,
        refetch,
    } = useGetSupportsQuery({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
    });

    // Get supports data from API response
    const apiSupports = useMemo(() => {
        return supportsData?.data?.data || [];
    }, [supportsData]);

    // Convert API supports to local supports
    const localSupports = useMemo(() => {
        return apiSupports.map(convertApiSupportToLocal);
    }, [apiSupports]);

    // Calculate pagination
    const totalReports = supportsData?.data?.meta?.total || 0;
    const totalPages = Math.ceil(totalReports / ITEMS_PER_PAGE);
    const paginatedReports = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return localSupports.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, localSupports]);

    const pageNumbers = useMemo(() => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }, [totalPages]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Calculate metrics
    const metrics = useMemo(() => {
        const pendingCount = apiSupports.filter((s: ApiSupport) => s.status === "pending" || s.status === "in_progress").length;

        const solvedCount = apiSupports.filter((s: ApiSupport) => s.status === "solved").length;

        const closedRejectedCount = apiSupports.filter((s: ApiSupport) => s.status === "closed" || s.status === "rejected").length;

        return {
            pending: pendingCount,
            solved: solvedCount,
            closedRejected: closedRejectedCount,
        };
    }, [apiSupports]);

    if (isError) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to load support tickets. Please try again.</AlertDescription>
                </Alert>
                <Button onClick={() => refetch()} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <main className="flex flex-col gap-8">
            {/* Header - EXACT SAME AS ORIGINAL */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden block" />
                    <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
                </div>
                <p className="text-[#4D5999]">Review and moderate reported content</p>
            </div>

            {/* Moderation Metrics - EXACT SAME AS ORIGINAL */}
            <div>
                <h2 className="mb-4 text-2xl font-bold">Moderation Metrics</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Pending Reports */}
                    <div className="border border-[#CFD4E8] rounded-md p-4">
                        <div className="pb-2">
                            <h3 className="font-medium text-[#0D0F1C]">Pending Reports</h3>
                        </div>
                        <div className="text-2xl font-bold">{isLoading ? "..." : metrics.pending}</div>
                    </div>

                    {/* Resolved */}
                    <div className="border border-[#CFD4E8] rounded-md p-4">
                        <div className="pb-2">
                            <h3 className="font-medium text-[#0D0F1C]">Resolved</h3>
                        </div>
                        <div className="text-2xl font-bold">{isLoading ? "..." : metrics.solved}</div>
                    </div>

                    {/* Dismissed */}
                    <div className="border border-[#CFD4E8] rounded-md p-4">
                        <div className="pb-2">
                            <h3 className="font-medium text-[#0D0F1C]">Dismissed</h3>
                        </div>
                        <div className="text-2xl font-bold">{isLoading ? "..." : metrics.closedRejected}</div>
                    </div>
                </div>
            </div>

            {/* Report Queue - EXACT SAME TABLE AS ORIGINAL */}
            <div>
                <h2 className="mb-4 text-xl font-semibold">Report Queue</h2>
                <Card className="p-0">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Report ID</TableHead>
                                    <TableHead>Content Type</TableHead>
                                    <TableHead>Reported By</TableHead>
                                    <TableHead>Reported Content</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            Loading support tickets...
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedReports.length > 0 ? (
                                    paginatedReports.map((report) => (
                                        <TableRow key={report.id} className="text-[#4D5999]">
                                            <TableCell className="font-medium ">{report.reportId}</TableCell>
                                            <TableCell>{getContentTypeDisplayName(report.contentType)}</TableCell>
                                            <TableCell>{report.reportedBy}</TableCell>
                                            <TableCell>{report.reportedContent}</TableCell>
                                            <TableCell>{getReasonDisplayName(report.reason)}</TableCell>
                                            {/* EXACTLY LIKE ORIGINAL: ReviewReportedContent renders its own TableCell */}
                                            <ReviewReportedContent support={report} />
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No support tickets found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Pagination - EXACT SAME AS ORIGINAL */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {paginatedReports.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, totalReports)} of {totalReports} reports
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    {pageNumbers.map((page) => (
                        <Button key={page} variant={currentPage === page ? "default" : "outline"} onClick={() => handlePageChange(page)} className={`w-10 h-10 ${currentPage === page ? "bg-[#5C22BF] text-white border-[#5C22BF]" : ""}`}>
                            {page}
                        </Button>
                    ))}
                    <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            </div>
        </main>
    );
}
