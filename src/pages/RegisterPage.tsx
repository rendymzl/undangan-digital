import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { register } from "../features/auth/authService";
import { toast } from "sonner";
import { useAuth } from "../features/auth/useAuth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      window.location.href = "/dashboard";
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await register(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Registrasi gagal");
    } else {
      toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Sisi Kiri: Ilustrasi atau Info (hanya tampil di desktop) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-primary/5 p-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Selamat Datang!</h2>
          <p className="text-muted-foreground text-lg text-center">
            Daftar untuk mulai membuat undangan pernikahan digitalmu sendiri dengan mudah dan cepat.
          </p>
          {/* Bisa tambahkan ilustrasi di sini jika ada */}
        </div>
        {/* Sisi Kanan: Form Register */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <Card className="w-full max-w-md mx-auto shadow-none border-0 md:shadow-none md:border-0 text-center bg-transparent">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="text-base"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="text-base"
              />
              <Button type="submit" disabled={loading} className="w-full text-base">
                {loading ? "Loading..." : "Register"}
              </Button>
            </form>
            <div className="mt-4 text-sm text-center">
              Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}