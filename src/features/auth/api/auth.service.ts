import { supabaseBrowser } from '@/lib/supabase-browser';

export const authService = {
  loginWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  },

  logout: async () => {
    const { error } = await supabaseBrowser.auth.signOut();
    if (error) {
      throw error;
    }
  },

  getSession: async () => {
    const { data, error } = await supabaseBrowser.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  },

  getUser: async () => {
    const { data, error } = await supabaseBrowser.auth.getUser();
    if (error) {
      throw error;
    }
    return data.user;
  },
};
