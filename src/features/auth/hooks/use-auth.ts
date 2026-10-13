'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { authService, isSuperAdminEmail } from '../api/auth.service';

export function useAuth() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const session = await authService.getSession();
        if (mounted) {
          if (session?.user && isSuperAdminEmail(session.user.email)) {
            setUserEmail(session.user.email || null);
            setIsAuthenticated(true);
          } else {
            setUserEmail(null);
            setIsAuthenticated(false);
          }
        }
      } catch {
        if (mounted) {
          setUserEmail(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkSession();

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          if (session?.user && isSuperAdminEmail(session.user.email)) {
            setUserEmail(session.user.email || null);
            setIsAuthenticated(true);
          } else {
            setUserEmail(null);
            setIsAuthenticated(false);
          }
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/login');
    }
  }, [router]);

  return {
    userEmail,
    loading,
    isAuthenticated,
    handleLogout,
  };
}
