import Login_Form from "@/components/forms/Login_Form";

const page = () => {
    return (
        <div className="min-h-screen flex items-center justify-center premium-sidebar p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>
            
            <div className="relative z-10 w-full flex justify-center">
                <Login_Form />
            </div>
        </div>
    );
};

export default page;
