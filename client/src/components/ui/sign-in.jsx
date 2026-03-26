import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- SUB-COMPONENTS ---
const GlassInputWrapper = ({ children }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-black/5 dark:bg-white/5 backdrop-blur-sm transition-colors focus-within:border-primary-500/70 focus-within:bg-primary-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 p-5 w-64 shadow-xl`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100">{testimonial.name}</p>
      <p className="text-gray-500 dark:text-gray-400">{testimonial.handle}</p>
      <p className="mt-1 text-gray-700 dark:text-gray-300 font-medium">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export const SignInPage = ({
  title = <span className="font-light tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  error = "",
  loading = false,
  heroImageSrc,
  testimonials = [],
  labels,
  onSignIn,
  onGoogleSignIn,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-white dark:bg-gray-900 transition-colors">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">{title}</h1>
            <p className="animate-element animate-delay-200 text-gray-500 dark:text-gray-400 font-medium text-lg">{description}</p>

            {error && (
              <div className="animate-element animate-delay-200 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">{labels.email}</label>
                <GlassInputWrapper>
                  <input name="email" type="email" required placeholder="you@example.com" className="w-full bg-transparent text-gray-900 dark:text-white text-base p-4 rounded-2xl focus:outline-none" />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">{labels.password}</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••" className="w-full bg-transparent text-gray-900 dark:text-white text-base p-4 pr-12 rounded-2xl focus:outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm font-medium border-b border-transparent pb-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 group-hover:border-primary-500 flex items-center justify-center transition-colors">
                    <input type="checkbox" name="rememberMe" className="opacity-0 absolute" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Keep me signed in</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); }} className="hover:underline text-primary-600 dark:text-primary-400 transition-colors">Reset password</a>
              </div>

              <button type="submit" disabled={loading} className="animate-element animate-delay-600 w-full rounded-2xl bg-primary-600 py-4 font-bold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-0.5 disabled:opacity-50 transition-all flex justify-center">
                {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : labels.signin_btn}
              </button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center mt-2">
              <span className="w-full border-t border-gray-200 dark:border-gray-800"></span>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 absolute font-medium">Or continue with</span>
            </div>

            <button onClick={onGoogleSignIn} type="button" className="animate-element animate-delay-800 font-bold text-gray-700 dark:text-gray-200 w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                <GoogleIcon />
                Continue with Google
            </button>

            <p className="animate-element animate-delay-900 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
              {labels.no_account}{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-primary-600 dark:text-primary-400 hover:underline transition-colors font-bold">{labels.create_one}</a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 lg:p-6">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 lg:inset-6 rounded-3xl bg-cover bg-center shadow-2xl overflow-hidden" style={{ backgroundImage: `url(${heroImageSrc})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-12 border-none left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center lg:scale-100 scale-90">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
