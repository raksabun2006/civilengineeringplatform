'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { getErrorMessage } from '@/lib/api/client';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white relative font-sans select-none">
      {/* =========================================================================
          LEFT PANEL: Construction Engineering Hero with Dark Navy Overlay
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#091528] overflow-hidden flex-col justify-between p-12 text-white">
        {/* Scaffolding & Construction Site Background Simulation */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Blueprint Grid Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081224] via-[#091528]/85 to-[#091528]/95 pointer-events-none" />

        {/* Top: Brand Logo */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-lg border-2 border-amber-400/90 bg-[#0B1A33]/80 flex items-center justify-center p-2 shadow-sm">
            {/* Bar icon */}
            <div className="flex items-end gap-1 h-5 w-5 justify-center">
              <div className="w-1.5 h-3 bg-amber-400 rounded-2xs" />
              <div className="w-1.5 h-5 bg-white rounded-2xs" />
              <div className="w-1.5 h-4 bg-amber-400 rounded-2xs" />
            </div>
          </div>
          <div>
            <div className="flex items-center text-xl font-bold tracking-tight">
              <span className="text-white">Engineer</span>
              <span className="text-amber-400">Biz</span>
            </div>
            <div className="h-[2px] w-full bg-amber-400 my-0.5 rounded-full" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-300 font-semibold block">
              ENGINEERING MANAGEMENT
            </span>
          </div>
        </div>

        {/* Middle: Hero Typography matching screenshot */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="w-10 h-1 bg-amber-400 rounded-full mb-4" />
          <p className="text-[11px] font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
            SIMPLIFY ENGINEERING BUSINESS MANAGEMENT
          </p>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.25] tracking-tight mb-6">
            សាងសង់អនាគត
            <br />
            ដោយការគ្រប់គ្រង
            <br />
            <span className="text-white">ដ៏ឆ្លាតវៃ។</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md font-medium">
            ប្រព័ន្ធគ្រប់គ្រងអាជីវកម្មវិស្វកម្មដែលបង្កើតឡើង
            <br />
            សម្រាប់ក្រុមហ៊ុនកម្ពុជារបស់អ្នក។
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
          <span>EngineerBiz Platform</span>
          <span>Photo by sky on Unsplash</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: Clean Login Form matching screenshot
      ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-8 relative">
        <div />

        {/* Main Centered Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <p className="text-xs font-semibold text-blue-600 mb-2">
              {language === 'km' ? 'សូមស្វាគមន៍មកកាន់ EngineerBiz' : 'Welcome to EngineerBiz'}
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'km' ? 'ចូលគណនីរបស់អ្នក' : 'Sign In to Your Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              {language === 'km'
                ? 'បញ្ចូលព័ត៌មានខាងក្រោមដើម្បីបន្ត'
                : 'Enter your credentials below to continue'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <span className="flex-1 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                {language === 'km' ? 'អ៊ីមែល' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dara@engineerbiz.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                {language === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{language === 'km' ? 'ចងចាំខ្ញុំ' : 'Remember me'}</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Please contact system administrator to reset password.')}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
              >
                {language === 'km' ? 'ភ្លេចពាក្យសម្ងាត់?' : 'Forgot password?'}
              </button>
            </div>

            {/* Deep Navy Blue Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0F2342] hover:bg-[#0B1A33] active:bg-[#071122] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Authenticating...'}</span>
                </span>
              ) : (
                <>
                  <span>{language === 'km' ? 'ចូលប្រើប្រព័ន្ធ' : 'Sign In'}</span>
                  <span className="text-base">→</span>
                </>
              )}
            </button>
          </form>

          {/* Trust Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <div className="h-4 w-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <ShieldCheck className="h-3 w-3" />
            </div>
            <span>
              {language === 'km'
                ? 'ទិន្នន័យរបស់អ្នកត្រូវបានការពារដោយសុវត្ថិភាព'
                : 'Your data is securely encrypted & protected'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-slate-400 pt-4 border-t border-slate-100 text-center">
          <span>© 2026 EngineerBiz</span>
          <span className="hidden sm:inline">·</span>
          <a href="#" className="hover:text-slate-600">
            {language === 'km' ? 'លក្ខខណ្ឌ' : 'Terms'}
          </a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600">
            {language === 'km' ? 'ឯកជនភាព' : 'Privacy'}
          </a>
        </div>

        {/* Floating Help (?) Button Bottom Right */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="mailto:support@engineerbiz.com.kh"
            title="Help & Support"
            className="h-10 w-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:shadow-xl transition-all"
          >
            <HelpCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
