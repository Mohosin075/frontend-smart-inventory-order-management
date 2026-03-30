# Smart Inventory & Order Management System (Frontend)

A modern, high-performance Inventory and Order Management Dashboard built with Next.js (App Router). This project is designed to help businesses track inventory, manage orders, and visualize performance analytics through an intuitive user interface.

# Live URL : https://195.35.6.13:3003

## 🚀 Key Features

- **Comprehensive Authentication:** Secure login, signup, password reset, and OTP verification flows.
- **Admin Dashboard Overview:** Real-time visualization of sales revenue, user engagement, and event trends using interactive charts (Recharts).
- **Inventory Management:** Full CRUD operations for products and categories with modal-based forms.
- **Order Management:** Streamlined order creation and tracking system.
- **Restock Queue:** Dedicated monitoring for low-stock items to ensure timely replenishment.
- **User Management:** Administrative tools to manage system users, roles, and permissions.
- **Activity Logs:** Detailed tracking of system actions for auditing and security.
- **Real-time Notifications:** Instant alerts for critical system events and updates.
- **Communication Suite:** Integrated internal chat and video/audio messaging capabilities (powered by Agora).
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing experiences.

## 🛠 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Real-time Engine:** [Socket.io](https://socket.io/) & [Agora RTC](https://www.agora.io/)

## 🏁 Getting Started

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend-smart-inventory-order-management
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_BASEURL=http://localhost:5000
# Add other necessary API keys (Agora, etc.) here
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📁 Project Structure

- `src/app`: Application router, pages, and layouts.
- `src/components`: Reusable UI components and feature-specific modules.
- `src/redux`: Redux store configuration, slices, and RTK Query API definitions.
- `src/lib`: Shared utility functions and configuration files.
- `src/hooks`: Custom React hooks for shared logic.
- `src/Provider`: Global context providers including Auth Guards and Redux.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
