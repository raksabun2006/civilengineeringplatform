'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { getErrorMessage } from '@/lib/api/client';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';
import { CambodiaFlag, UkFlag } from '@/components/ui/country-flag';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { language, setLanguage, getLocalizedPath } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(getLocalizedPath('/dashboard'));
    }
  }, [isAuthenticated, router, getLocalizedPath]);

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
          LEFT PANEL: Construction Engineering Hero with Clean Visible Photo
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        {/* Construction Site Background Photo focused on the engineer */}
        <div
          className="absolute inset-0 bg-cover bg-[position:82%_center] pointer-events-none"
          style={{
            backgroundImage: `url('/images/login-banner.jpg')`,
          }}
        />

        {/* Directional gradient: darker on the left for sharp text readability, transparent on the right where the engineer is */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none" />

        {/* Top: Brand Logo */}
        <div className="relative z-10 flex items-center gap-3.5 bg-black/30 backdrop-blur-xs p-2.5 pr-4 rounded-2xl w-fit border border-white/10 shadow-sm">
          <div className="h-11 w-11 rounded-lg border-2 border-amber-400 bg-[#0C1E3C] flex items-center justify-center p-2 shadow-sm">
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
            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-200 font-bold block">
              ENGINEERING MANAGEMENT
            </span>
          </div>
        </div>

        {/* Middle: Hero Typography matching screenshot */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="w-8 h-1 bg-amber-400 rounded-full mb-3 shadow-sm" />
          <p className="text-[11px] font-bold tracking-[0.2em] text-amber-300 uppercase mb-5 drop-shadow-md">
            SIMPLIFY ENGINEERING BUSINESS MANAGEMENT
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.3] tracking-tight mb-6 drop-shadow-lg">
            សាងសង់អនាគត
            <br />
            ដោយការគ្រប់គ្រង
            <br />
            <span className="text-white">ដ៏ឆ្លាតវៃ។</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-md font-medium drop-shadow-md bg-black/25 backdrop-blur-2xs p-3.5 rounded-xl border border-white/10">
            ប្រព័ន្ធគ្រប់គ្រងអាជីវកម្មវិស្វកម្មដែលបង្កើតឡើង
            <br />
            សម្រាប់ក្រុមហ៊ុនកម្ពុជារបស់អ្នក។
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 bg-black/25 backdrop-blur-2xs px-3.5 py-1.5 rounded-lg border border-white/10 w-fit gap-3">
          <span>EngineerBiz Platform</span>
          <span>·</span>
          <span>Civil Engineering Management</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: Clean Login Form matching screenshot
      ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-8 relative bg-white">
        <div className="flex justify-end w-full">
          {/* Single Country Flag (Click to toggle language, no bg or border) */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            title={
              language === 'km'
                ? 'ភាសាខ្មែរ (ចុចដើម្បីប្តូរទៅជា English)'
                : 'English (Click to switch to ភាសាខ្មែរ)'
            }
            aria-label="Toggle language"
            className="p-1 rounded-sm hover:opacity-80 transition-opacity cursor-pointer shrink-0 inline-flex items-center justify-center"
          >
            {language === 'km' ? (
              <CambodiaFlag className="w-7 h-5 rounded-xs object-cover" />
            ) : (
              <UkFlag className="w-7 h-5 rounded-xs object-cover" />
            )}
          </button>
        </div>

        {/* Main Centered Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <p className="text-xs font-semibold text-blue-600 mb-2">
              {language === 'km' ? 'សូមស្វាគមន៍មកកាន់ EngineerBiz' : 'Welcome to EngineerBiz'}
            </p>
            <h2 className="text-3xl font-extrabold text-[#0B192C] tracking-tight">
              {language === 'km' ? 'ចូលគណនីរបស់អ្នក' : 'Sign In to Your Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
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
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
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
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
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
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
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
              className="w-full h-12 bg-[#0B192C] hover:bg-[#071324] active:bg-[#040c17] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
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
          <span>© 2024 EngineerBiz</span>
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
