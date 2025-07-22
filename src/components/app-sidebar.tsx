import { Home, Plus, Book, User, LogOut, Gift } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { logout } from "@/features/auth/authService"

const menuUtama = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    match: (pathname: string) => pathname === "/dashboard",
  },
  {
    title: "Buat Undangan",
    url: "/dashboard/buat-undangan",
    icon: Plus,
    match: (pathname: string) => pathname === "/dashboard/buat-undangan",
  },
  // Hapus menu 'Undangan Saya'
]

// const menuLainnya = [
//   {
//     title: "Profil",
//     url: "#profil",
//     icon: User,
//     match: (pathname: string) => pathname === "#profil",
//   },
// ]

export function AppSidebar() {
  const navigate = useNavigate()

  // Fungsi logout dummy, ganti dengan implementasi asli jika perlu
  const handleLogout = () => {
    // Tambahkan konfirmasi sebelum logout
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout()
    }
  }

  // Ambil lokasi saat ini
  const location = useLocation()
  const pathname = location.pathname + location.hash

  // Sidebar menu dinamis: tampilkan menu kelola amplop digital jika sedang di halaman tersebut
  const showAmplopMenu = pathname.startsWith("/dashboard/amplop-digital/");

  // Scroll ke menu aktif saat sidebar dibuka (UX improvement)
  useEffect(() => {
    const activeMenu = document.querySelector('[data-active="true"]')
    if (activeMenu) {
      activeMenu.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [pathname])

  return (
    <Sidebar className="min-h-screen bg-white border-r shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo atau Judul Aplikasi */}
        <div className="flex items-center gap-2 px-4 py-5 border-b">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg tracking-wide text-gray-800">Dua Mempelai</span>
        </div>
        <SidebarContent className="flex-1 flex flex-col justify-between">
          <div>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">Menu Utama</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuUtama.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.match(pathname)}
                        // Hapus hover custom, gunakan default shadcn
                        className={`rounded-lg px-3 py-2 flex items-center gap-2 font-medium text-sm ${
                          item.match(pathname)
                            ? "bg-blue-100 text-blue-700"
                            : ""
                        }`}
                        data-active={item.match(pathname) ? "true" : undefined}
                      >
                        <a href={item.url} tabIndex={0}>
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {showAmplopMenu && (
                    <SidebarMenuItem key="Kelola Amplop Digital">
                      <SidebarMenuButton
                        asChild
                        isActive={true}
                        className="rounded-lg px-3 py-2 flex items-center gap-2 font-medium text-sm bg-blue-100 text-blue-700"
                        data-active="true"
                      >
                        <a href={pathname} tabIndex={0}>
                          <Gift className="w-5 h-5" />
                          <span>Kelola Amplop Digital</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {/* <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lainnya</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuLainnya.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.match(pathname)}
                        // Hapus hover custom, gunakan default shadcn
                        className={`rounded-lg px-3 py-2 flex items-center gap-2 font-medium text-sm ${
                          item.match(pathname)
                            ? "bg-blue-100 text-blue-700"
                            : ""
                        }`}
                        data-active={item.match(pathname) ? "true" : undefined}
                      >
                        <a href={item.url} tabIndex={0}>
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup> */}
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t px-4 py-3 bg-gray-50">
          <Button
            variant="ghost"
            className="w-full justify-start truncate overflow-x-hidden text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 w-5 h-5" /> Logout
          </Button>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}