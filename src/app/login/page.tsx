import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Super Admin Login — Pathiq Diagnostics',
  description: 'Authorized platform administrator access.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-teal-600 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
