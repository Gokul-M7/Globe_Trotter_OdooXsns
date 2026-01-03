import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Map,
    PlusCircle,
    Settings,
    LogOut,
    Globe,
    User,
    Compass,
    Plane,
    Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
    const location = useLocation();
    const { user, signOut } = useAuth();

    const links = [
        {
            title: "Core",
            items: [
                {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    label: "My Trips",
                    href: "/trips", // Note: Need to ensure this route exists or redirect to dashboard
                    icon: Map,
                },
                {
                    label: "Bookings",
                    href: "/bookings",
                    icon: Plane,
                },
                {
                    label: "Explore",
                    href: "/explore",
                    icon: Compass,
                },
                {
                    label: "Community",
                    href: "/community",
                    icon: Users,
                },
            ],
        },
        {
            title: "Actions",
            items: [
                {
                    label: "Create Trip",
                    href: "/trips/new",
                    icon: PlusCircle,
                },
            ],
        },
        {
            title: "Settings",
            items: [
                {
                    label: "Profile",
                    href: "/profile",
                    icon: User,
                },
                {
                    label: "Settings",
                    href: "/settings", // Placeholder
                    icon: Settings,
                },
            ],
        },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 animate-slide-in-left z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean to-coral flex items-center justify-center shadow-lg">
                    <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    GoVenture
                </span>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
                {links.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                            isActive
                                                ? "bg-ocean text-white shadow-md shadow-ocean/20"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Sidebar;
