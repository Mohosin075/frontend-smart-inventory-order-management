// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { TableCell } from "@/components/ui/table";

// const ReviewReportedContent = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const handleOpen = () => setIsOpen(true);
//     const handleClose = () => setIsOpen(false);

//     const handleDismissReport = () => {
//         // Handle dismiss report logic
//         console.log("Report dismissed");
//         handleClose();
//     };

//     const handleDeleteComment = () => {
//         // Handle delete comment logic
//         console.log("Comment deleted");
//         handleClose();
//     };

//     return (
//         <>
//             {/* Review Button */}
//             <TableCell>
//                 <Button variant="ghost" size="sm" className="text-[#4D5999] hover:text-[#4D5999] cursor-pointer" onClick={handleOpen}>
//                     Review
//                 </Button>
//             </TableCell>

//             {/* Modal */}
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                 <DialogContent className="max-w-2xl">
//                     <DialogHeader>
//                         <DialogTitle className="text-xl font-semibold">Review Reported Content</DialogTitle>
//                         <DialogDescription className="text-base">Review and manage reported content.</DialogDescription>
//                     </DialogHeader>

//                     <div className="space-y-6 py-4">
//                         {/* Reported Content Section */}
//                         <div className="space-y-4">
//                             <h3 className="text-lg font-medium">Reported Content</h3>

//                             <p className="text-foreground font-medium">Offensive language in comment section</p>
//                         </div>

//                         <Separator />

//                         {/* Report Details Section */}
//                         <div className="space-y-4">
//                             <h3 className="text-lg font-medium">Report Details</h3>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-muted-foreground">Report ID</p>
//                                     <p className="font-medium">#12345</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-muted-foreground">Content Type</p>
//                                     <p className="font-medium">Comment</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-muted-foreground">Reported By</p>
//                                     <p className="font-medium">Liam Carter</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-muted-foreground">Reason</p>
//                                     <p className="font-medium text-red-600">Harassment</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <Separator />

//                         {/* User Information Section */}
//                         <div className="space-y-4">
//                             <h3 className="text-lg font-medium">User Information</h3>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-muted-foreground">User ID</p>
//                                     <p className="font-medium">#54321</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-muted-foreground">Username</p>
//                                     <p className="font-medium">Liam Carter</p>
//                                 </div>
//                                 <div className="col-span-2 space-y-2">
//                                     <p className="text-sm text-muted-foreground">Email</p>
//                                     <p className="font-medium">liam.carter@email.com</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3 ">
//                         <Button variant="outline" className="text-[#4D5999] border-[#4D5999] hover:bg-[#4D5999]/10 " onClick={handleDismissReport}>
//                             Dismiss Report
//                         </Button>
//                         <Button variant="destructive" onClick={handleDeleteComment}>
//                             Delete Comment
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export default ReviewReportedContent;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TableCell } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDeleteSupportMutation, useUpdateSupportStatusMutation, SUPPORT_STATUS } from "@/redux/features/support/supportApi";

interface SupportData {
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

interface ReviewReportedContentProps {
    support?: SupportData;
}

const ReviewReportedContent = ({ support }: ReviewReportedContentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // RTK Query mutations
    const [deleteSupport, { isLoading: isDeleting }] = useDeleteSupportMutation();
    const [updateSupportStatus, { isLoading: isUpdating }] = useUpdateSupportStatusMutation();

    const handleOpen = () => {
        if (support) {
            setIsOpen(true);
            setErrorMessage("");
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleDismissReport = async () => {
        if (!support) return;

        try {
            await updateSupportStatus({
                id: support.id,
                status: SUPPORT_STATUS.SOLVED, // Dismiss = Mark as solved
            }).unwrap();
            handleClose();
        } catch (error: any) {
            console.error("Failed to dismiss report:", error);
            setErrorMessage(error?.data?.message || "Failed to dismiss report");
        }
    };

    const handleDeleteSupport = async () => {
        if (!support) return;

        if (confirm("Are you sure you want to delete this support ticket? This action cannot be undone.")) {
            try {
                await deleteSupport(support.id).unwrap();
                handleClose();
            } catch (error: any) {
                console.error("Failed to delete support:", error);
                setErrorMessage(error?.data?.message || "Failed to delete support ticket");
            }
        }
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

    if (!support) {
        return (
            <TableCell>
                <Button variant="ghost" size="sm" disabled className="text-primary hover:text-primary/80 cursor-pointer">
                    Review
                </Button>
            </TableCell>
        );
    }

    return (
        <>
            {/* Review Button */}
            <TableCell>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 cursor-pointer" onClick={handleOpen}>
                    Review
                </Button>
            </TableCell>

            {/* Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Review Reported Content</DialogTitle>
                        <DialogDescription className="text-base">Review and manage reported content.</DialogDescription>
                    </DialogHeader>

                    {/* Error Message (only shows if there's an error) */}
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-6 py-4">
                        {/* Reported Content Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Reported Content</h3>
                            <p className="text-foreground font-medium">{support.message || "No message provided"}</p>
                        </div>

                        <Separator />

                        {/* Report Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Report Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Report ID</p>
                                    <p className="font-medium">{support.reportId}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Content Type</p>
                                    <p className="font-medium">{getContentTypeDisplayName(support.contentType)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Reported By</p>
                                    <p className="font-medium">{support.reportedBy}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Reason</p>
                                    <p className="font-medium text-destructive">{getReasonDisplayName(support.reason)}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* User Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">User Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">User ID</p>
                                    <p className="font-medium">{support.userId || "#N/A"}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Username</p>
                                    <p className="font-medium">{support.reportedBy}</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{support.userEmail || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary" onClick={handleDismissReport} disabled={isUpdating || isDeleting}>
                            Dismiss Report
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSupport} disabled={isDeleting || isUpdating}>
                            Delete Comment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ReviewReportedContent;
