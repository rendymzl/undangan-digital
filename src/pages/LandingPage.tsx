import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Undangan Digital</h1>
        <p className="mb-6 text-gray-600">
          Buat dan bagikan undangan pernikahan digital yang elegan dan mudah.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/register">Register</a>
          </Button>
        </div>
      </Card>
    </div>
  );
} 