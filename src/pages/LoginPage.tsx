import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { login } from "../features/auth/authService";
import { toast } from "sonner";
import { useAuth } from "../features/auth/useAuth";

export default function LoginPage() {
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
    const { error } = await login(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Login gagal");
    } else {
      toast.success("Login berhasil!");
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Sisi Kiri: Ilustrasi atau Info (hanya tampil di desktop) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-primary/5 p-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Selamat Datang Kembali!</h2>
          <p className="text-muted-foreground text-lg text-center">
            Masuk untuk mengelola undangan pernikahan digitalmu dengan mudah dan cepat.
          </p>
          {/* Bisa tambahkan ilustrasi di sini jika ada */}
        </div>
        {/* Sisi Kanan: Form Login */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <Card className="w-full max-w-md mx-auto shadow-none border-0 md:shadow-none md:border-0 text-center bg-transparent">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Login</h2>
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
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-sm text-center">
              Belum punya akun? <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}