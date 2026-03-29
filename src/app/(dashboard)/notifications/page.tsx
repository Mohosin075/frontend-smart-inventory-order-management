// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import NotificationHistory from "@/components/dashboard/notification/NotificationHistory";

// interface Notification {
//     id: string;
//     title: string;
//     audience: string;
//     sentDate: string;
//     openRate: number;
//     engagement: string;
// }

// export default function NotificationsComponent() {
//     const [formData, setFormData] = useState({
//         title: "",
//         message: "",
//         notificationType: "Event Alert",
//         targetAudience: "All Users",
//         scheduleForLater: false,
//         date: "",
//         time: "",
//     });

//     const [notifications, setNotifications] = useState<Notification[]>([
//         {
//             id: "1",
//             title: "Event Reminder",
//             audience: "All Users",
//             sentDate: "2024-01-15",
//             openRate: 75,
//             engagement: "12%",
//         },
//         {
//             id: "2",
//             title: "New Feature Announcement",
//             audience: "Active Users",
//             sentDate: "2024-01-10",
//             openRate: 60,
//             engagement: "8%",
//         },
//         {
//             id: "3",
//             title: "Community Update",
//             audience: "All Users",
//             sentDate: "2023-12-20",
//             openRate: 80,
//             engagement: "15%",
//         },
//         {
//             id: "4",
//             title: "Holiday Greetings",
//             audience: "All Users",
//             sentDate: "2023-12-15",
//             openRate: 90,
//             engagement: "20%",
//         },
//         {
//             id: "5",
//             title: "Survey Invitation",
//             audience: "Selected Users",
//             sentDate: "2023-12-01",
//             openRate: 50,
//             engagement: "5%",
//         },
//         {
//             id: "6",
//             title: "Special Offer",
//             audience: "Active Users",
//             sentDate: "2023-11-25",
//             openRate: 70,
//             engagement: "18%",
//         },
//         {
//             id: "7",
//             title: "System Maintenance",
//             audience: "All Users",
//             sentDate: "2023-11-20",
//             openRate: 85,
//             engagement: "10%",
//         },
//     ]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSelectChange = (value: string, field: string) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const handleSwitchChange = (checked: boolean) => {
//         setFormData((prev) => ({ ...prev, scheduleForLater: checked }));
//     };

//     const handleSendNotification = () => {
//         if (!formData.title.trim() || !formData.message.trim()) {
//             alert("Please fill in title and message");
//             return;
//         }

//         const newNotification: Notification = {
//             id: String(notifications.length + 1),
//             title: formData.title,
//             audience: formData.targetAudience,
//             sentDate: new Date().toISOString().split("T")[0],
//             openRate: 0,
//             engagement: "0%",
//         };

//         setNotifications((prev) => [newNotification, ...prev]);
//         setFormData({
//             title: "",
//             message: "",
//             notificationType: "Event Alert",
//             targetAudience: "All Users",
//             scheduleForLater: false,
//             date: "",
//             time: "",
//         });
//     };

//     const handleClear = () => {
//         setFormData({
//             title: "",
//             message: "",
//             notificationType: "Event Alert",
//             targetAudience: "All Users",
//             scheduleForLater: false,
//             date: "",
//             time: "",
//         });
//     };

//     return (
//         <div>
//             <div>
//                 <div className="flex items-center gap-2 mb-8">
//                     <SidebarTrigger className="md:hidden block" />
//                     <h1 className="text-3xl font-bold ">Notifications</h1>
//                 </div>
//             </div>

//             {/* Create Notification Form */}
//             <div className="space-y-6 mb-8">
//                 <div className="space-y-4">
//                     <h2 className="text-xl font-bold">Create Notification</h2>
//                     <div className="space-y-6">
//                         {/* Title and Type Row */}
//                         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                             <div className="space-y-2">
//                                 <Label htmlFor="title">Title</Label>
//                                 <Input className="bg-[#E8E8F2]" id="title" name="title" placeholder="Enter notification title" value={formData.title} onChange={handleInputChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="notificationType">Notification Type</Label>
//                                 <Select value={formData.notificationType} onValueChange={(value) => handleSelectChange(value, "notificationType")}>
//                                     <SelectTrigger id="notificationType" className="bg-[#E8E8F2] w-full">
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="Event Alert">Event Alert</SelectItem>
//                                         <SelectItem value="System Notice">System Notice</SelectItem>
//                                         <SelectItem value="Promotion">Promotion</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         {/* Message */}
//                         <div className="space-y-2">
//                             <Label htmlFor="message">Message</Label>
//                             <Textarea id="message" name="message" placeholder="Enter notification message" value={formData.message} onChange={handleInputChange} className="min-h-32 bg-[#E8E8F2]" />
//                         </div>

//                         {/* Target Audience */}
//                         <div className="space-y-2">
//                             <Label htmlFor="targetAudience">Target Audience</Label>
//                             <Select value={formData.targetAudience} onValueChange={(value) => handleSelectChange(value, "targetAudience")}>
//                                 <SelectTrigger id="targetAudience" className="bg-[#E8E8F2] w-full md:w-60">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="All Users">All Users</SelectItem>
//                                     <SelectItem value="Active Users">Active Users</SelectItem>
//                                     <SelectItem value="Event Organizers">Event Organizers</SelectItem>
//                                     <SelectItem value="Selected Users">Selected Users</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {/* Schedule Section */}
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3">
//                                 <Switch id="scheduleForLater" checked={formData.scheduleForLater} onCheckedChange={handleSwitchChange} />
//                                 <Label htmlFor="scheduleForLater">Schedule for later</Label>
//                             </div>

//                             {formData.scheduleForLater && (
//                                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="date">Date</Label>
//                                         <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} className="bg-[#E8E8F2]" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="time">Time</Label>
//                                         <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} className="bg-[#E8E8F2]" />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex gap-3 pt-2">
//                             <Button onClick={handleSendNotification} className="bg-primary hover:bg-primary/90">
//                                 Send Notification
//                             </Button>
//                             <Button variant="outline" onClick={handleClear}>
//                                 Clear
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Notification History */}

//             <NotificationHistory></NotificationHistory>
//         </div>
//     );
// }

"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationHistory from "@/components/dashboard/notification/NotificationHistory";

import { toast } from "sonner";
import { useCreateManualNotificationMutation } from "@/redux/features/notification/notificationApi";

// Map your UI values to API enum values
const audienceMap: Record<string, string> = {
    "All Users": "all_user",
    "Active Users": "active_user",
    "Event Organizers": "organizer",
    "Selected Users": "admin", // Assuming Selected Users maps to ADMIN
};

const typeMap: Record<string, string> = {
    "Event Alert": "EVENT_REMINDER",
    "System Notice": "SYSTEM_ALERT",
    Promotion: "PROMOTIONAL",
};

interface Notification {
    id: string;
    title: string;
    audience: string;
    sentDate: string;
    openRate: number;
    engagement: string;
}

export default function NotificationsComponent() {
    const [createNotification, { isLoading }] = useCreateManualNotificationMutation();
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        notificationType: "Event Alert",
        targetAudience: "All Users",
        scheduleForLater: false,
        date: "",
        time: "",
    });

    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "Event Reminder",
            audience: "All Users",
            sentDate: "2024-01-15",
            openRate: 75,
            engagement: "12%",
        },
        {
            id: "2",
            title: "New Feature Announcement",
            audience: "Active Users",
            sentDate: "2024-01-10",
            openRate: 60,
            engagement: "8%",
        },
        {
            id: "3",
            title: "Community Update",
            audience: "All Users",
            sentDate: "2023-12-20",
            openRate: 80,
            engagement: "15%",
        },
        {
            id: "4",
            title: "Holiday Greetings",
            audience: "All Users",
            sentDate: "2023-12-15",
            openRate: 90,
            engagement: "20%",
        },
        {
            id: "5",
            title: "Survey Invitation",
            audience: "Selected Users",
            sentDate: "2023-12-01",
            openRate: 50,
            engagement: "5%",
        },
        {
            id: "6",
            title: "Special Offer",
            audience: "Active Users",
            sentDate: "2023-11-25",
            openRate: 70,
            engagement: "18%",
        },
        {
            id: "7",
            title: "System Maintenance",
            audience: "All Users",
            sentDate: "2023-11-20",
            openRate: 85,
            engagement: "10%",
        },
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string, field: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, scheduleForLater: checked }));
    };

    const handleSendNotification = async () => {
        if (!formData.title.trim() || !formData.message.trim()) {
            toast.error("Please fill in title and message");
            return;
        }

        try {
            // Map form data to API request format
            const notificationData = {
                targetAudience: audienceMap[formData.targetAudience] || "all_user",
                title: formData.title,
                content: formData.message,
                type: typeMap[formData.notificationType] || "SYSTEM_ALERT",
                channel: "IN_APP", // Assuming this is always IN_APP from your form
                priority: "MEDIUM", // Assuming this is always MEDIUM from your form
            };

            // Send notification to API
            await createNotification(notificationData).unwrap();

            // Add to local state for immediate UI update
            const newNotification: Notification = {
                id: String(notifications.length + 1),
                title: formData.title,
                audience: formData.targetAudience,
                sentDate: new Date().toISOString().split("T")[0],
                openRate: 0,
                engagement: "0%",
            };

            setNotifications((prev) => [newNotification, ...prev]);

            // Reset form
            setFormData({
                title: "",
                message: "",
                notificationType: "Event Alert",
                targetAudience: "All Users",
                scheduleForLater: false,
                date: "",
                time: "",
            });

            toast.success("Notification sent successfully!");
        } catch (error) {
            console.error("Failed to send notification:", error);
            toast.error("Failed to send notification. Please try again.");
        }
    };

    const handleClear = () => {
        setFormData({
            title: "",
            message: "",
            notificationType: "Event Alert",
            targetAudience: "All Users",
            scheduleForLater: false,
            date: "",
            time: "",
        });
    };

    return (
        <div>
            <div>
                <div className="flex items-center gap-2 mb-8">
                    <SidebarTrigger className="md:hidden block" />
                    <h1 className="text-3xl font-bold ">Notifications</h1>
                </div>
            </div>

            {/* Create Notification Form */}
            <div className="space-y-6 mb-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Create Notification</h2>
                    <div className="space-y-6">
                        {/* Title and Type Row */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input className="bg-[#E8E8F2]" id="title" name="title" placeholder="Enter notification title" value={formData.title} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notificationType">Notification Type</Label>
                                <Select value={formData.notificationType} onValueChange={(value) => handleSelectChange(value, "notificationType")}>
                                    <SelectTrigger id="notificationType" className="bg-[#E8E8F2] w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Event Alert">Event Alert</SelectItem>
                                        <SelectItem value="System Notice">System Notice</SelectItem>
                                        <SelectItem value="Promotion">Promotion</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Enter notification message" value={formData.message} onChange={handleInputChange} className="min-h-32 bg-[#E8E8F2]" />
                        </div>

                        {/* Target Audience */}
                        <div className="space-y-2">
                            <Label htmlFor="targetAudience">Target Audience</Label>
                            <Select value={formData.targetAudience} onValueChange={(value) => handleSelectChange(value, "targetAudience")}>
                                <SelectTrigger id="targetAudience" className="bg-[#E8E8F2] w-full md:w-60">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Users">All Users</SelectItem>
                                    <SelectItem value="Active Users">Active Users</SelectItem>
                                    <SelectItem value="Event Organizers">Event Organizers</SelectItem>
                                    <SelectItem value="Selected Users">Selected Users</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Schedule Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Switch id="scheduleForLater" checked={formData.scheduleForLater} onCheckedChange={handleSwitchChange} />
                                <Label htmlFor="scheduleForLater">Schedule for later</Label>
                            </div>

                            {formData.scheduleForLater && (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} className="bg-[#E8E8F2]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} className="bg-[#E8E8F2]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button onClick={handleSendNotification} className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send Notification"}
                            </Button>
                            <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification History */}
            <NotificationHistory></NotificationHistory>
        </div>
    );
}
