import { supabaseBrowser } from '@/lib/supabase-browser';

const ALLOWED_ADMINS = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter((e) => e.length > 0);

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email || ALLOWED_ADMINS.length === 0) return false;
  return ALLOWED_ADMINS.includes(email.trim().toLowerCase());
}

export const authService = {
  loginWithEmail: async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Fast pre-auth allowlist check
    if (!isSuperAdminEmail(cleanEmail)) {
      throw new Error('Access Denied: This account is not authorized as a Super Admin.');
    }

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (error) {
      throw error;
    }

    if (!isSuperAdminEmail(data.user?.email)) {
      await supabaseBrowser.auth.signOut();
      throw new Error('Access Denied: This account is not authorized as a Super Admin.');
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
