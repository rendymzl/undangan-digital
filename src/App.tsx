import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UndanganDetailPage from "./pages/UndanganDetailPage";
import { Toaster } from "sonner";
import Layout from "./layouts/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/dashboard/DashboardPage";
import BuatUndanganPage from "./pages/dashboard/BuatUndanganPage";
import PilihTemplatePage from "./pages/dashboard/PilihTemplatePage";
import PreviewPage from "./pages/PreviewPage";
import SemuaTemplatePage from "./pages/SemuaTemplatePage";
import ManagePaymentsPage from "./pages/admin/ManagePaymentsPage";
import { useAuth } from "./features/auth/useAuth";
import UndangTamuPage from "./pages/dashboard/UndangTamuPage";

// --- 2. Create a component specifically for admin routes ---
const AdminRoutes = () => {
  const { user } = useAuth();

  // ADD THIS LINE FOR DEBUGGING
  console.log("Checking Admin Access. User Object:", user);

  const isAdmin = user?.user_metadata?.role === 'admin';

  return isAdmin ? <Outlet /> : <div>Access Denied</div>;
};

function App() {

  return (
    <>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<SemuaTemplatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="buat-undangan" element={<BuatUndanganPage />} />
              <Route path="edit-undangan/:id" element={<BuatUndanganPage />} />
              <Route path="pilih-template" element={<PilihTemplatePage />} />
              <Route path="undang-tamu/:invitationId" element={<UndangTamuPage />} />
              <Route path="undang-tamu/" element={<UndangTamuPage />} />
            </Route>
          </Route>

          <Route element={<AdminRoutes />}>
            <Route path="/admin/manage-payments" element={<ManagePaymentsPage />} />
          </Route>

          <Route path="/preview/draft" element={<PreviewPage />} />
          <Route path="/:slug" element={<UndanganDetailPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
