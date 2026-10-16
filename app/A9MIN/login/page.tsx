'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/A9MIN';
  const redirectTarget = (!rawRedirect || rawRedirect.startsWith('/A9MIN/login') || rawRedirect.startsWith('/admin/login') || rawRedirect === '/login')
    ? '/A9MIN'
    : rawRedirect;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Non-blocking background session check with timeout
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    async function checkExistingSession() {
      try {
        const res = await fetch('/api/auth/me', { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && isMounted) {
            setSuccessMsg('Sesi aktif terdeteksi. Mengalihkan ke panel...');
            setTimeout(() => {
              if (isMounted) {
                router.replace(redirectTarget);
              }
            }, 300);
            return;
          }
        }
      } catch (err: unknown) {
        // Silently ignore abort or network issues on initial check
        if (err instanceof Error && err.name !== 'AbortError') {
          console.warn('Session check info:', err.message);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    checkExistingSession();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim() || !password) {
      setErrorMsg('Mohon lengkapi username/email dan kata sandi.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Verifikasi berhasil! Mengarahkan ke panel...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 600);
      } else {
        setErrorMsg(data.error || 'Autentikasi gagal. Silakan periksa kembali data Anda.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan sambungan jaringan ke server.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F4EFE6] relative flex flex-col justify-between overflow-hidden selection:bg-[#C9A96A] selection:text-[#0E1014]">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#C9A96A]/15 via-[#C9A96A]/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[350px] bg-amber-900/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Top Bar with Back to Live Site Link */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#C9A96A] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-[#C9A96A] group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Website</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] text-white/50 tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Akses Terenkripsi</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">
          {/* Card Container */}
          <div className="relative rounded-2xl bg-[#16191E]/90 backdrop-blur-xl border border-white/[0.1] shadow-2xl shadow-black/80 p-6 sm:p-9 transition-all">
            {/* Top Glowing Edge Accent */}
            <div className="absolute -top-[1px] inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96A] to-transparent" />

            {/* Header / Logo */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner mb-4">
                <img
                  src="/assets/logo-tbk.png"
                  alt="Logo PT. TBK"
                  className="h-12 w-auto object-contain"
                />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-[#C9A96A]/10 border border-[#C9A96A]/30 text-[#C9A96A] text-[11px] font-bold uppercase tracking-widest mb-2">
                Panel Pengelola CMS
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4EFE6] font-syne">
                Masuk ke Admin Panel
              </h1>
              <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                PT. Terbang Bersama Kawan (PT. TBK) &bull; Puri Gunung Langgar
              </p>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username/Email Input */}
              <div>
                <label 
                  htmlFor="identifier" 
                  className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5"
                >
                  Username atau Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin atau admin@terbangbersamakawan.co.id"
                    disabled={loading}
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1014]/90 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#C9A96A] focus:ring-1 focus:ring-[#C9A96A] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="password" 
                    className="block text-xs font-semibold uppercase tracking-wider text-white/80"
                  >
                    Kata Sandi (Password)
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    disabled={loading}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0E1014]/90 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#C9A96A] focus:ring-1 focus:ring-[#C9A96A] transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-[#0E1014] text-[#C9A96A] focus:ring-[#C9A96A] focus:ring-offset-0"
                  />
                  <span className="text-xs text-white/70">Ingat sesi saya (30 hari)</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C9A96A] to-[#B88E3F] hover:opacity-95 text-[#0E1014] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A96A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Masuk ke Admin Panel</span>
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-[11.5px] text-white/40">
            &copy; {new Date().getFullYear()} PT. Terbang Bersama Kawan. Hak Cipta Dilindungi.
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-white/30">
        Keamanan terlindungi dengan enkripsi sesi SQL dan cookies HTTP-only
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#C9A96A] animate-spin" />
            <span className="text-xs text-white/70 font-sans tracking-wider uppercase">
              Memuat Halaman Login...
            </span>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
