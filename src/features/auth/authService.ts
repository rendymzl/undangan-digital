import { supabase } from '../../lib/supabaseClient';

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { user: data.user, error };
};

export const register = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  return { user: data.user, error };
};

// Fungsi logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
