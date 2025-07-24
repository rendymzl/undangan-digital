import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BuatUndanganPage from "./pages/BuatUndanganPage";
import UndanganDetailPage from "./pages/UndanganDetailPage";
import GaleriUndanganPage from "./pages/GaleriUndanganPage";
import RSVPUndanganPage from "./pages/RSVPUndanganPage";
import AmplopUndanganPage from "./pages/AmplopUndanganPage";
import PreviewUndangan from "./pages/preview/[slug]";
import { Toaster } from "sonner";
import Layout from "./layouts/layout";
import AmplopDigitalManagePage from "./pages/dashboard/AmplopDigitalManagePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="buat-undangan" element={<BuatUndanganPage />} />
              <Route path="edit-undangan/:id" element={<BuatUndanganPage />} />
              <Route path="amplop-digital/:invitationId" element={<AmplopDigitalManagePage />} />
            </Route>
          </Route>

          <Route path="/preview/draft" element={<PreviewUndangan />} />
          <Route path="/:slug" element={<UndanganDetailPage />} />
          <Route path="/:slug/galeri" element={<GaleriUndanganPage />} />
          <Route path="/:slug/rsvp" element={<RSVPUndanganPage />} />
          <Route path="/:slug/amplop" element={<AmplopUndanganPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
