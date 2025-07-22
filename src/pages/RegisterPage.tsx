import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { register } from "../features/auth/authService";
import { toast } from "sonner";
import { useAuth } from "../features/auth/useAuth";
import { useEffect } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
        <div className="mt-4 text-sm">
          Sudah punya akun? <a href="/login" className="text-blue-600">Login</a>
        </div>
      </Card>
    </div>
  );
} 