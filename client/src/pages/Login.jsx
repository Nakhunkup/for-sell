import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInPage } from '../components/ui/sign-in';
import { useAuthStore, useLangStore } from '../store';
import { translations } from '../translations';
import api from '../api';

const sampleTestimonials = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The online courses transformed how I upskill every single day."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I learn. Clean design, powerful features, and excellent courses."
  }
];

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setAuth } = useAuthStore();
  const { lang } = useLangStore();
  const t = translations[lang].auth;
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Ensure email and password exist
    if (!data.email || !data.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError("Google Sign-In is not currently configured for this demo.");
  };

  const handleCreateAccount = () => {
    navigate('/register');
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white -mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
      <SignInPage
        title={<span className="font-extrabold tracking-tight">{t.welcome}</span>}
        description={t.welcome_sub}
        error={error}
        loading={loading}
        heroImageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateAccount={handleCreateAccount}
        labels={{
          email: t.email,
          password: t.password,
          signin_btn: t.signin_btn,
          no_account: t.no_account,
          create_one: t.create_one
        }}
      />
    </div>
  );
};

export default Login;
