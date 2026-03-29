// "use client";

// import { useState, useRef, useEffect, useMemo } from "react";
// import { Search, MessageCircle, Send } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useGetUserProfileQuery } from "@/redux/features/user/userApi";

// interface Message {
//     id: string;
//     name: string;
//     initials: string;
//     preview: string;
//     timestamp: string;
//     unread: boolean;
// }

// interface ChatMessage {
//     id: string;
//     sender: "user" | "attendee";
//     text: string;
//     timestamp: string;
// }

// const initialMessages: Message[] = [
//     {
//         id: "1",
//         name: "Sarah Johnson",
//         initials: "SJ",
//         preview: "Thank you! Looking forward to the event.",
//         timestamp: "2 min ago",
//         unread: true,
//     },
//     {
//         id: "2",
//         name: "Mike Chen",
//         initials: "MC",
//         preview: "Got it, thanks for the update!",
//         timestamp: "30 min ago",
//         unread: false,
//     },
//     {
//         id: "3",
//         name: "Emily Davis",
//         initials: "ED",
//         preview: "Is there parking available at the venue?",
//         timestamp: "1 hour ago",
//         unread: true,
//     },
//     {
//         id: "4",
//         name: "James Wilson",
//         initials: "JW",
//         preview: "See you there! Can't wait.",
//         timestamp: "2 hours ago",
//         unread: false,
//     },
//     {
//         id: "5",
//         name: "Alex Turner",
//         initials: "AT",
//         preview: "Do you have any vegan options?",
//         timestamp: "5 hours ago",
//         unread: false,
//     },
// ];

// const chatHistory: Record<string, ChatMessage[]> = {
//     "1": [
//         { id: "1", sender: "attendee", text: "Hi! I'm excited about the tech conference.", timestamp: "10:30 AM" },
//         { id: "2", sender: "user", text: "Welcome Sarah! We're excited to have you.", timestamp: "10:32 AM" },
//         { id: "3", sender: "attendee", text: "Thank you! Looking forward to the event.", timestamp: "10:35 AM" },
//     ],
//     "2": [
//         { id: "1", sender: "attendee", text: "Got the ticket confirmation, thanks!", timestamp: "Yesterday" },
//         { id: "2", sender: "user", text: "Great! Let us know if you need anything.", timestamp: "Yesterday" },
//     ],
//     "3": [{ id: "1", sender: "attendee", text: "Hi, is there parking available at the venue?", timestamp: "1 hour ago" }],
//     "4": [
//         { id: "1", sender: "attendee", text: "See you there! Can't wait.", timestamp: "2 hours ago" },
//         { id: "2", sender: "user", text: "Looking forward to meeting you!", timestamp: "2 hours ago" },
//     ],
//     "5": [
//         { id: "1", sender: "attendee", text: "Do you have any vegan options for lunch?", timestamp: "5 hours ago" },
//         { id: "2", sender: "user", text: "Yes! We have several vegan options available.", timestamp: "4 hours ago" },
//     ],
// };

// export default function MessagesPage() {
//     const { data: myProfile } = useGetUserProfileQuery();
//     console.log(myProfile);

//     const [selectedMessage, setSelectedMessage] = useState<string>("1");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [messageInput, setMessageInput] = useState("");
//     const [messages, setMessages] = useState<Message[]>(initialMessages);
//     const [filter, setFilter] = useState<string>("all");
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     // Use useMemo to fix the dependency warning
//     const selectedAttendee = useMemo(() => messages.find((m) => m.id === selectedMessage), [messages, selectedMessage]);

//     // Use useMemo to fix the dependency warning
//     const currentChat = useMemo(() => chatHistory[selectedMessage] || [], [selectedMessage]);

//     const unreadCount = messages.filter((m) => m.unread).length;

//     const handleSendMessage = () => {
//         if (!messageInput.trim() || !selectedMessage) return;

//         const newMessage: ChatMessage = {
//             id: Date.now().toString(),
//             sender: "user",
//             text: messageInput,
//             timestamp: "Just now",
//         };

//         chatHistory[selectedMessage] = [...(chatHistory[selectedMessage] || []), newMessage];

//         // Use functional update to avoid dependency on messages
//         setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === selectedMessage ? { ...msg, preview: messageInput, timestamp: "Just now", unread: false } : msg)));

//         setMessageInput("");
//     };

//     const handleSelectMessage = (id: string) => {
//         setSelectedMessage(id);
//         // Mark as read when selecting a message
//         setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg)));
//     };

//     const filteredMessages = useMemo(
//         () =>
//             messages
//                 .filter((message) => {
//                     if (filter === "unread") return message.unread;
//                     if (filter === "read") return !message.unread;
//                     return true;
//                 })
//                 .filter((message) => message.name.toLowerCase().includes(searchQuery.toLowerCase()) || message.preview.toLowerCase().includes(searchQuery.toLowerCase())),
//         [messages, filter, searchQuery],
//     );

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [currentChat]);

//     return (
//         <div className="flex flex-col lg:flex-row h-screen bg-background">
//             {/* Left Panel - Messages List */}
//             <div className="w-full lg:w-80 border-r border-border bg-card flex flex-col h-1/2 lg:h-full">
//                 {/* Header */}
//                 <div className="border-b border-border p-4">
//                     <div className="flex items-center gap-2">
//                         <SidebarTrigger className="md:hidden block" />
//                         <h1 className="text-xl font-bold text-foreground">Messages</h1>
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-1">Contact attendees</p>
//                     <Badge className="mt-2" variant="secondary">
//                         {unreadCount} unread
//                     </Badge>
//                 </div>

//                 {/* Search and Filter */}
//                 <div className="p-3 border-b border-border space-y-3">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                         <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-muted" />
//                     </div>

//                     <Select value={filter} onValueChange={setFilter}>
//                         <SelectTrigger className="w-full bg-muted">
//                             <SelectValue placeholder="Filter" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="all">All Messages</SelectItem>
//                             <SelectItem value="unread">Unread</SelectItem>
//                             <SelectItem value="read">Read</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Messages List */}
//                 <div className="flex-1 overflow-y-auto">
//                     {filteredMessages.length === 0 ? (
//                         <div className="p-6 text-center">
//                             <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
//                             <p className="text-muted-foreground">No messages found</p>
//                         </div>
//                     ) : (
//                         filteredMessages.map((message) => (
//                             <div key={message.id} onClick={() => handleSelectMessage(message.id)} className={`p-3 border-b border-border cursor-pointer hover:bg-muted/50 ${selectedMessage === message.id ? "bg-muted" : ""}`}>
//                                 <div className="flex items-start gap-3">
//                                     <Avatar className="h-10 w-10">
//                                         <AvatarFallback className="bg-muted text-foreground">{message.initials}</AvatarFallback>
//                                     </Avatar>
//                                     <div className="flex-1 min-w-0">
//                                         <div className="flex items-center justify-between mb-1">
//                                             <h3 className="font-medium text-foreground truncate">{message.name}</h3>
//                                             <div className="flex items-center gap-2">
//                                                 {message.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
//                                                 <span className="text-xs text-muted-foreground">{message.timestamp}</span>
//                                             </div>
//                                         </div>
//                                         <p className="text-sm text-muted-foreground truncate">{message.preview}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Right Panel - Chat */}
//             <div className="flex-1 flex flex-col bg-background">
//                 {selectedAttendee ? (
//                     <>
//                         <div className="border-b border-border p-4">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <Avatar className="h-10 w-10">
//                                         <AvatarFallback className="bg-muted text-foreground">{selectedAttendee.initials}</AvatarFallback>
//                                     </Avatar>
//                                     <div>
//                                         <h2 className="font-semibold text-foreground">{selectedAttendee.name}</h2>
//                                         <p className="text-xs text-muted-foreground">Last message: {selectedAttendee.timestamp}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Chat Messages */}
//                         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                             {currentChat.map((msg) => (
//                                 <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                                     <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
//                                         <p className="text-sm">{msg.text}</p>
//                                         <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         {/* Message Input */}
//                         <div className="border-t border-border p-4">
//                             <div className="flex items-center gap-2">
//                                 <Input placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 bg-muted" />
//                                 <Button onClick={handleSendMessage} size="sm" className="gap-2 bg-foreground text-background hover:opacity-90" disabled={!messageInput.trim()}>
//                                     <Send className="w-4 h-4" />
//                                     Send
//                                 </Button>
//                             </div>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="flex-1 flex flex-col items-center justify-center p-6">
//                         <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center mb-4">
//                             <MessageCircle className="w-10 h-10 text-muted-foreground" />
//                         </div>
//                         <h2 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h2>
//                         <p className="text-sm text-muted-foreground text-center">Choose from the list to start messaging</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, MessageCircle, Send, Image as ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetUserProfileQuery } from "@/redux/features/user/userApi";
import { useGetChatsQuery, Chat } from "@/redux/features/chat/chatApi";
import { io, Socket } from "socket.io-client";
import { useGetMessagesQuery, useSendMessageMutation } from "@/redux/features/message/messageApi";
import Image from "next/image";

export default function MessagesPage() {
    const { data: myProfile } = useGetUserProfileQuery();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    // RTK Query hooks
    const {
        data: chatsData,
        isLoading: isLoadingChats,
        refetch: refetchChats,
    } = useGetChatsQuery(undefined, {
        pollingInterval: 30000,
    });

    const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(selectedChatId!, {
        skip: !selectedChatId,
    });

    const [sendMessage] = useSendMessageMutation();

    const userId = myProfile?.data?._id || myProfile?.data?.id;

    // Fix for React Compiler: Use simpler dependency array
    const chats = useMemo(() => chatsData?.data?.chats || [], [chatsData?.data?.chats]);

    // Filter chats based on search
    const filteredChats = chats.filter((chat: Chat) => {
        const otherParticipant = chat.participants.find((p) => p._id !== userId);
        if (!otherParticipant) return false;

        return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Get selected chat details
    const selectedChat = chats.find((chat: Chat) => chat._id === selectedChatId);

    // Get other participant in selected chat
    const otherParticipant = selectedChat?.participants.find((p) => p._id !== userId);

    // Fix for React Compiler: Use simpler dependency for messages
    const messages = useMemo(() => messagesData?.data || [], [messagesData]);

    // Format messages for display
    const chatMessages = useMemo(() => {
        if (!userId) return [];
        return messages.map((msg) => ({
            id: msg._id,
            _id: msg._id,
            chatId: msg.chatId,
            sender: msg.sender === userId ? "user" : "other",
            text: msg.text,
            image: msg.image ? `${process.env.NEXT_PUBLIC_BASEURL}${msg.image}` : undefined,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            seen: msg.seen,
        }));
    }, [userId, messages]);

    const socketRef = useRef<Socket | null>(null);

    // Socket connection
    useEffect(() => {
        if (!userId) return;

        if (!socketRef.current) {
            const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4005", {
                query: { userId },
            });

            // Setup event listeners
            newSocket.on("connect", () => {
                console.log("Socket connected");
            });

            newSocket.on("userOnline", (userId: string) => {
                setOnlineUsers((prev) => new Set([...prev, userId]));
            });

            newSocket.on("userOffline", (userId: string) => {
                setOnlineUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
            });

            newSocket.on("newMessage", (message: any) => {
                if (message.chatId === selectedChatId) {
                    refetchMessages();
                }
                refetchChats();
            });

            newSocket.on("messageSeen", (data: { chatId: string; messageId: string }) => {
                if (data.chatId === selectedChatId) {
                    refetchMessages();
                }
            });

            socketRef.current = newSocket;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId, selectedChatId, refetchMessages, refetchChats]);

    // Send message
    const handleSendMessage = async () => {
        if ((!messageInput.trim() && !selectedImage) || !selectedChatId || !userId) return;

        try {
            const messageData = {
                chatId: selectedChatId,
                text: messageInput,
                ...(selectedImage && { image: selectedImage }),
            };

            await sendMessage(messageData).unwrap();

            // Use the socket from ref
            if (socketRef.current) {
                socketRef.current.emit("sendMessage", {
                    chatId: selectedChatId,
                    sender: userId,
                    text: messageInput,
                    image: selectedImage ? "image_uploaded" : null,
                });
            }

            setMessageInput("");
            setSelectedImage(null);
            setImagePreview(null);
            refetchMessages();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle chat selection
    const handleSelectChat = (chatId: string) => {
        setSelectedChatId(chatId);

        // Use the socket from ref
        if (socketRef.current) {
            socketRef.current.emit("markAsRead", { chatId, userId });
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const unreadCount = chatsData?.data?.totalUnreadChats || 0;

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background">
            {/* Left Panel - Messages List */}
            <div className="w-full lg:w-80 border-r border-border bg-card flex flex-col h-1/2 lg:h-full">
                {/* Header */}
                <div className="border-b border-border p-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden block" />
                        <h1 className="text-xl font-bold text-foreground">Messages</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Contact attendees</p>
                    <Badge className="mt-2" variant="secondary">
                        {unreadCount} unread
                    </Badge>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search chats..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-muted" />
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoadingChats ? (
                        <div className="p-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground mt-2">Loading chats...</p>
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-6 text-center">
                            <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No chats found</p>
                        </div>
                    ) : (
                        filteredChats.map((chat: Chat) => {
                            const otherParticipant = chat.participants.find((p) => p._id !== userId);
                            const isOnline = otherParticipant ? onlineUsers.has(otherParticipant._id) : false;

                            return (
                                <div key={chat._id} onClick={() => handleSelectChat(chat._id)} className={`p-3 border-b border-border cursor-pointer hover:bg-muted/50 ${selectedChatId === chat._id ? "bg-muted" : ""}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={otherParticipant?.profile ? `${process.env.NEXT_PUBLIC_BASEURL}${otherParticipant.profile}` : undefined} alt={otherParticipant?.name} />
                                                <AvatarFallback className="bg-muted text-foreground">{otherParticipant?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                                            </Avatar>
                                            {isOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium text-foreground truncate">{otherParticipant?.name || "Unknown User"}</h3>
                                                <div className="flex items-center gap-2">
                                                    {chat.unreadCount > 0 && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(chat.updatedAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage?.text || "No messages yet"}</p>
                                            {chat.unreadCount > 0 && (
                                                <Badge variant="secondary" className="mt-1 text-xs">
                                                    {chat.unreadCount} new
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Panel - Chat */}
            <div className="flex-1 flex flex-col bg-background">
                {selectedChat && otherParticipant ? (
                    <>
                        <div className="border-b border-border p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={otherParticipant.profile ? `${process.env.NEXT_PUBLIC_BASEURL}${otherParticipant.profile}` : undefined} alt={otherParticipant.name} />
                                            <AvatarFallback className="bg-muted text-foreground">{otherParticipant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {onlineUsers.has(otherParticipant._id) && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-foreground">{otherParticipant.name}</h2>
                                        <p className="text-xs text-muted-foreground">{onlineUsers.has(otherParticipant._id) ? "Online" : "Offline"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                                        {msg.image && (
                                            <div className="mb-2">
                                                <div className="relative w-[400px] h-[400px]">
                                                    <Image src={msg.image} alt="Message attachment" fill className="rounded-lg object-contain" sizes="400px" quality={100} priority={true} />
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs opacity-70">{msg.timestamp}</p>
                                            {msg.sender === "user" && <div className="flex items-center gap-1">{msg.seen ? <span className="text-xs opacity-70">✓✓</span> : <span className="text-xs opacity-70">✓</span>}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="px-4 pt-2">
                                <div className="relative inline-block h-20 w-20">
                                    <Image src={imagePreview} alt="Preview" fill className="rounded-lg border object-cover" sizes="80px" />
                                    <button onClick={removeImage} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 z-10">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="border-t border-border p-4">
                            <div className="flex items-center gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} title="Upload image">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Input placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 bg-muted" />
                                <Button onClick={handleSendMessage} size="sm" className="gap-2 bg-foreground text-background hover:opacity-90" disabled={!messageInput.trim() && !selectedImage}>
                                    <Send className="w-4" />
                                    Send
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center mb-4">
                            <MessageCircle className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h2>
                        <p className="text-sm text-muted-foreground text-center">Choose from the list to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
