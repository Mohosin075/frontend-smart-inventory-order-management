// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Users, Calendar, FilePlus, AlertCircle } from "lucide-react";

// export default function DashboardOverview() {
//     const stats = [
//         {
//             title: "Total Users",
//             value: "12,847",
//             change: "+12.5%",
//             isPositive: true,
//             icon: Users,
//             color: "bg-blue-500",
//         },
//         {
//             title: "Active Events",
//             value: "1,234",
//             change: "+8.3%",
//             isPositive: true,
//             icon: Calendar,
//             color: "bg-green-500",
//         },
//         {
//             title: "Events Created",
//             value: "567",
//             change: "-5%",
//             isPositive: false,
//             icon: FilePlus,
//             color: "bg-purple-500",
//         },
//         {
//             title: "Pending Reviews",
//             value: "23",
//             change: "+100%",
//             isPositive: true,
//             icon: AlertCircle,
//             color: "bg-amber-500",
//         },
//     ];

//     return (
//         <div className="w-full mb-10">
//             {/* Dashboard Title */}
//             <div className="mb-8">
//                 <div className="flex items-center gap-2">
//                     <SidebarTrigger className="md:hidden block" />
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
//                 </div>
//                 <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with ascela today</p>
//             </div>

//             {/* Stats Cards Grid */}
//             <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {stats.map((stat, index) => (
//                     <div key={index} className="w-full bg-white rounded-xl shadow-sm border border-[#CFD4E8] p-6 ">
//                         <div className="flex items-start justify-between mb-4">
//                             <div className="flex-1">
//                                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
//                             </div>
//                             <div className={`${stat.color} p-3 rounded-lg text-white shrink-0 ml-4`}>
//                                 <stat.icon className="w-6 h-6" />
//                             </div>
//                         </div>
//                         <div className="flex items-center">
//                             <span className={`text-sm font-medium ${stat.isPositive ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
//                             <span className="text-gray-500 text-sm ml-2">from last month</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Users, Calendar, FilePlus, AlertCircle, ShoppingCart, Package, IndianRupee, TrendingUp } from "lucide-react";
import { useGetDashboardInsightsQuery } from "@/redux/features/dashboard/dashboardApi";


export default function DashboardOverview() {
    const { data, isLoading, error } = useGetDashboardInsightsQuery(undefined);

    const stats = [

        {
            title: "Total Revenue",
            value: data?.data?.totalRevenue?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || "₹0",
            change: "+12.5%",
            isPositive: true,
            icon: IndianRupee,
            color: "bg-emerald-500",
        },
        {
            title: "Total Orders",
            value: data?.data?.totalOrders?.toString() || "0",
            change: "+8.3%",
            isPositive: true,
            icon: ShoppingCart,
            color: "bg-blue-500",
        },
        {
            title: "Products",
            value: data?.data?.totalProducts?.toString() || "0",
            change: "+5.1%",
            isPositive: true,
            icon: Package,
            color: "bg-indigo-500",
        },
        {
            title: "Growth",
            value: "24.8%",
            change: "+2.4%",
            isPositive: true,
            icon: TrendingUp,
            color: "bg-violet-500",
        },
    ];


    if (isLoading) {
        return (
            <div className="w-full mb-10">
                <div className="mb-10">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden block">
                            <SidebarTrigger />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
                            <p className="text-gray-500 mt-1 text-sm font-medium italic">Preparing your dashboard insights...</p>
                        </div>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                            <div className="h-28"></div>
                        </div>
                    ))}
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full mb-10">
                <div className="mb-10">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden block">
                            <SidebarTrigger />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
                            <p className="text-red-500 mt-1 text-sm font-medium italic">Failed to load dashboard data. Please refresh.</p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="w-full mb-10">
            {/* Dashboard Title */}
            <div className="mb-10">
                <div className="flex items-center gap-3">
                    <div className="md:hidden block">
                        <SidebarTrigger />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium italic">Welcome back! Here&apos;s what&apos;s happening with Smart Inventory today.</p>
                    </div>
                </div>
            </div>


            {/* Stats Cards Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="group w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{stat.value}</h3>
                            </div>
                            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-100`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center relative z-10">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${stat.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                                {stat.isPositive ? "+" : ""}{stat.change}
                            </div>
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wide ml-2">vs last month</span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
