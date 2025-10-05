import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
// Mock types for demo purposes
type AuthChangeEvent = string;
type Session = { user: User } | null;
type User = {
  id: string;
  email?: string;
  [key: string]: any;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    checkAuth();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading
  };
}
