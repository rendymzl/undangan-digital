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
} from "@/components/ui/sidebar";
import { 
  LogOut, Home, Plus, Book, User, Users, Mail, 
  CreditCard, BarChart3, Settings, HelpCircle,
  CheckSquare, Send, Receipt, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { logout } from "@/features/auth/authService";
import { toast } from "sonner";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

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
              <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/dashboard'}>
                      <Link to="/dashboard">
                        <Home className="mr-2 w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/dashboard/pilih-template'}>
                      <Link to="/dashboard/pilih-template">
                        <Plus className="mr-2 w-4 h-4" />
                        <span>Buat Undangan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/dashboard' && location.hash === '#undangan-saya'}>
                      <Link to="/dashboard#undangan-saya">
                        <Book className="mr-2 w-4 h-4" />
                        <span>Undangan Saya</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/templates'}>
                      <Link to="/templates">
                        <FileText className="mr-2 w-4 h-4" />
                        <span>Template</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Manajemen Tamu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/undang-tamu')}>
                      <Link to="/dashboard/undang-tamu">
                        <Users className="mr-2 w-4 h-4" />
                        <span>Daftar Tamu</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/rsvp')}>
                      <Link to="/dashboard/rsvp">
                        <CheckSquare className="mr-2 w-4 h-4" />
                        <span>RSVP</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/kirim-undangan')}>
                      <Link to="/dashboard/kirim-undangan">
                        <Send className="mr-2 w-4 h-4" />
                        <span>Kirim Undangan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Pembayaran</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/pembayaran')}>
                      <Link to="/dashboard/pembayaran">
                        <CreditCard className="mr-2 w-4 h-4" />
                        <span>Pembayaran</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/transaksi')}>
                      <Link to="/dashboard/transaksi">
                        <Receipt className="mr-2 w-4 h-4" />
                        <span>Riwayat Transaksi</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/statistik')}>
                      <Link to="/dashboard/statistik">
                        <BarChart3 className="mr-2 w-4 h-4" />
                        <span>Statistik</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/profil')}>
                      <Link to="/dashboard/profil">
                        <User className="mr-2 w-4 h-4" />
                        <span>Profil</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/pengaturan')}>
                      <Link to="/dashboard/pengaturan">
                        <Settings className="mr-2 w-4 h-4" />
                        <span>Pengaturan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/dashboard/bantuan')}>
                      <Link to="/dashboard/bantuan">
                        <HelpCircle className="mr-2 w-4 h-4" />
                        <span>Bantuan</span>
                      </Link>
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