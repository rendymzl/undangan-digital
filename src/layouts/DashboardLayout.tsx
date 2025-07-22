import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "../components/ui/sidebar";
import { LogOut, Home, Plus, Book, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../features/auth/useAuth";
import { logout } from "../features/auth/authService";
import { toast } from "sonner";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil logout");
    window.location.href = "/login";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="border-r bg-white overflow-x-hidden">
          <SidebarHeader>
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="font-semibold text-base mt-1">{user?.email}</div>
            </div>
          </SidebarHeader>
          <SidebarContent className="overflow-x-hidden">
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={true}>
                      <a href="/dashboard">
                        <Home className="mr-2 w-4 h-4" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/buat-undangan">
                        <Plus className="mr-2 w-4 h-4" />
                        <span>Buat Undangan</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#undangan-saya">
                        <Book className="mr-2 w-4 h-4" />
                        <span>Undangan Saya</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Lainnya</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#profil">
                        <User className="mr-2 w-4 h-4" />
                        <span>Profil</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </SidebarContent>
          <SidebarFooter className="overflow-x-hidden">
            <Button variant="ghost" className="w-full justify-start truncate overflow-x-hidden" onClick={handleLogout}>
              <LogOut className="mr-2 w-4 h-4" /> Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
} 