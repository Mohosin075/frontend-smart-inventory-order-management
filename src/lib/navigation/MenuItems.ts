import { 
    LayoutDashboard, 
    Box, 
    Layers, 
    ShoppingCart, 
    ClipboardList, 
    History 
} from "lucide-react";

export interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType<any>;
}

const inventoryMenuItems: MenuItem[] = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        url: "/products",
        icon: Box,
    },
    {
        title: "Categories",
        url: "/categories",
        icon: Layers,
    },
    {
        title: "Orders",
        url: "/orders",
        icon: ShoppingCart,
    },
    {
        title: "Restock Queue",
        url: "/restock-queue",
        icon: ClipboardList,
    },
    {
        title: "Activity Logs",
        url: "/activity-logs",
        icon: History,
    },
];

export const menuItems: Record<string, MenuItem[]> = {
    admin: inventoryMenuItems,
    super_admin: inventoryMenuItems,
    manager: inventoryMenuItems,
    user: inventoryMenuItems,
};
