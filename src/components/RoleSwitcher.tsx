// "use client";
// import { useState } from "react";
// import { Users, User } from "lucide-react";
// import { useUserRole } from "@/lib/navigation/MenuItems";
// // import { useRouter } from "next/navigation";

// export function RoleSwitcher() {
//     const { role, setUserRole } = useUserRole();
//     const [showTooltip, setShowTooltip] = useState(false);
//     // const router = useRouter();

//     const toggleRole = () => {
//         const newRole = role === "admin" ? "organizer" : "admin";
//         setUserRole(newRole);
//         setTimeout(() => {
//             window.location.href = "/";
//             // window.location.reload();
//             // router.push("/");
//         }, 100);
//     };

//     return (
//         <div className="fixed bottom-6 right-6 z-50">
//             <button onClick={toggleRole} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 rounded-full p-3 transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md" title={`Switch to ${role === "admin" ? "Organizer" : "Admin"} role`}>
//                 <div className="flex items-center justify-center w-6 h-6">{role === "admin" ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}</div>
//             </button>

//             {/* Tooltip */}
//             {showTooltip && <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap shadow-lg">Switch to {role === "admin" ? "Organizer" : "Admin"}</div>}
//         </div>
//     );
// }
