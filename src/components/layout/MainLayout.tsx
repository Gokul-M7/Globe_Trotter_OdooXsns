import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TravelBot from "../chat/TravelBot";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MainLayout = ({ children, showFooter = true }: MainLayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div className="md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          {/* No trigger here, we use a custom button in main area */}
          <SheetContent side="left" className="p-0 w-64 border-r border-slate-800 bg-slate-900 border-none text-white">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-white/80 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <span className="ml-4 font-bold text-lg text-ocean">GoVenture</span>
          </div>
          {/* Mobile User Icon (Simplified) */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-ocean/20 flex items-center justify-center text-ocean font-bold border border-ocean/30 text-xs">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-border items-center justify-end px-6 bg-white/50 backdrop-blur sticky top-0 z-40">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-foreground">
                  {user.user_metadata?.full_name || "Traveler"}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-ocean/20 flex items-center justify-center text-ocean font-bold border border-ocean/30 shadow-sm">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                onClick={() => signOut()}
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button className="bg-ocean hover:bg-ocean-dark">Sign In</Button>
            </Link>
          )}
        </header>

        <main className="flex-1 px-4 py-2 md:px-6 md:pt-2 md:pb-6 animate-fade-in overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Chatbot */}
      <TravelBot />
    </div>
  );
};

export default MainLayout;
