export interface IUser {
    id: string;
    name: string;
    joinDate: string;
    role: "User" | "organizer" | "Admin";
    status: "Active" | "Pending" | "Suspended";
    eventsCreated: number;
}

export const MOCK_USERS: IUser[] = [
    { id: "1", name: "Sophia Clark", joinDate: "1/15/2024", role: "organizer", status: "Active", eventsCreated: 12 },
    { id: "2", name: "Ethan Bennett", joinDate: "1/15/2024", role: "User", status: "Active", eventsCreated: 0 },
    { id: "3", name: "Olivia Carter", joinDate: "1/15/2024", role: "User", status: "Suspended", eventsCreated: 0 },
    { id: "4", name: "Liam Davis", joinDate: "1/15/2024", role: "organizer", status: "Active", eventsCreated: 0 },
    { id: "5", name: "Ava Evans", joinDate: "1/15/2024", role: "User", status: "Suspended", eventsCreated: 0 },
    { id: "6", name: "Noah Foster", joinDate: "1/15/2024", role: "organizer", status: "Pending", eventsCreated: 0 },
    { id: "7", name: "Sarah Johnson", joinDate: "1/15/2024", role: "User", status: "Active", eventsCreated: 5 },
    { id: "8", name: "James Wilson", joinDate: "1/15/2024", role: "Admin", status: "Active", eventsCreated: 25 },
    { id: "9", name: "Emma Brown", joinDate: "1/15/2024", role: "organizer", status: "Active", eventsCreated: 8 },
    { id: "10", name: "Michael Chen", joinDate: "1/15/2024", role: "User", status: "Active", eventsCreated: 2 },
    { id: "11", name: "Jessica Lee", joinDate: "1/15/2024", role: "organizer", status: "Suspended", eventsCreated: 3 },
    { id: "12", name: "David Martinez", joinDate: "1/15/2024", role: "User", status: "Pending", eventsCreated: 0 },

    // New Users
    { id: "13", name: "Daniel Cooper", joinDate: "2/01/2024", role: "User", status: "Active", eventsCreated: 1 },
    { id: "14", name: "Madison Perez", joinDate: "2/01/2024", role: "organizer", status: "Active", eventsCreated: 6 },
    { id: "15", name: "Elijah Brooks", joinDate: "2/01/2024", role: "User", status: "Active", eventsCreated: 0 },
    { id: "16", name: "Isabella Rivera", joinDate: "2/01/2024", role: "organizer", status: "Pending", eventsCreated: 0 },
    { id: "17", name: "Alexander King", joinDate: "2/01/2024", role: "User", status: "Suspended", eventsCreated: 0 },
    { id: "18", name: "Grace Hall", joinDate: "2/01/2024", role: "User", status: "Active", eventsCreated: 4 },
    { id: "19", name: "Benjamin Scott", joinDate: "2/01/2024", role: "organizer", status: "Active", eventsCreated: 10 },
    { id: "20", name: "Chloe Adams", joinDate: "2/01/2024", role: "User", status: "Active", eventsCreated: 1 },
    { id: "21", name: "Lucas Turner", joinDate: "2/01/2024", role: "Admin", status: "Active", eventsCreated: 40 },
    { id: "22", name: "Harper Nelson", joinDate: "2/01/2024", role: "User", status: "Pending", eventsCreated: 0 },
    { id: "23", name: "Jack Ramirez", joinDate: "2/01/2024", role: "organizer", status: "Active", eventsCreated: 7 },
    { id: "24", name: "Victoria Clark", joinDate: "2/01/2024", role: "User", status: "Suspended", eventsCreated: 0 },
    { id: "25", name: "Mason Hughes", joinDate: "2/01/2024", role: "User", status: "Active", eventsCreated: 3 },

    { id: "26", name: "Ella Ward", joinDate: "2/15/2024", role: "organizer", status: "Active", eventsCreated: 9 },
    { id: "27", name: "Henry Cox", joinDate: "2/15/2024", role: "User", status: "Active", eventsCreated: 0 },
    { id: "28", name: "Scarlett Morgan", joinDate: "2/15/2024", role: "User", status: "Pending", eventsCreated: 0 },
    { id: "29", name: "Wyatt Bailey", joinDate: "2/15/2024", role: "organizer", status: "Suspended", eventsCreated: 2 },
    { id: "30", name: "Natalie Hughes", joinDate: "2/15/2024", role: "User", status: "Active", eventsCreated: 5 },
    { id: "31", name: "Logan Stewart", joinDate: "2/15/2024", role: "User", status: "Active", eventsCreated: 0 },
    { id: "32", name: "Avery Reed", joinDate: "2/15/2024", role: "organizer", status: "Active", eventsCreated: 11 },
    { id: "33", name: "Sebastian Bell", joinDate: "2/15/2024", role: "User", status: "Suspended", eventsCreated: 0 },
    { id: "34", name: "Hannah Rivera", joinDate: "2/15/2024", role: "User", status: "Active", eventsCreated: 2 },
    { id: "35", name: "Owen Parker", joinDate: "2/15/2024", role: "organizer", status: "Pending", eventsCreated: 0 },

    { id: "36", name: "Layla Torres", joinDate: "3/01/2024", role: "User", status: "Active", eventsCreated: 1 },
    { id: "37", name: "Caleb Mitchell", joinDate: "3/01/2024", role: "organizer", status: "Suspended", eventsCreated: 4 },
    { id: "38", name: "Aria Simmons", joinDate: "3/01/2024", role: "User", status: "Active", eventsCreated: 3 },
    { id: "39", name: "Nathan Hayes", joinDate: "3/01/2024", role: "organizer", status: "Active", eventsCreated: 14 },
    { id: "40", name: "Zoe Price", joinDate: "3/01/2024", role: "User", status: "Pending", eventsCreated: 0 },
    { id: "41", name: "Eli Griffin", joinDate: "3/01/2024", role: "User", status: "Active", eventsCreated: 1 },
    { id: "42", name: "Penelope Foster", joinDate: "3/01/2024", role: "organizer", status: "Active", eventsCreated: 5 },
    { id: "43", name: "Hudson Brown", joinDate: "3/01/2024", role: "User", status: "Suspended", eventsCreated: 0 },
    { id: "44", name: "Lily Richardson", joinDate: "3/01/2024", role: "User", status: "Active", eventsCreated: 2 },
    { id: "45", name: "Gabriel Hughes", joinDate: "3/01/2024", role: "organizer", status: "Active", eventsCreated: 13 },
    { id: "46", name: "Paisley Cooper", joinDate: "3/01/2024", role: "User", status: "Active", eventsCreated: 1 },
    { id: "47", name: "Joseph Reed", joinDate: "3/01/2024", role: "User", status: "Suspended", eventsCreated: 0 },
    { id: "48", name: "Hazel Murphy", joinDate: "3/01/2024", role: "organizer", status: "Active", eventsCreated: 6 },
    { id: "49", name: "Thomas Rivera", joinDate: "3/01/2024", role: "Admin", status: "Active", eventsCreated: 35 },
    { id: "50", name: "Aurora Myers", joinDate: "3/01/2024", role: "User", status: "Pending", eventsCreated: 0 },
];
