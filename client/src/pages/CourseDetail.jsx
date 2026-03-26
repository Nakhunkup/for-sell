import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuthStore } from '../store';
import { Lock, PlayCircle, FileText, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        
        if (user) {
          const purRes = await api.get('/payments/my-purchases');
          const purchased = purRes.data.some(p => p.courseId === id);
          setHasPurchased(purchased || user.role === 'instructor' && res.data.instructorId === user.id);
        }
      } catch (err) {
        console.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setPurchasing(true);
    try {
      await api.post('/payments/checkout', { courseId: id, paymentMethod: 'simulated' });
      setHasPurchased(true);
      alert('Payment successful!');
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );
  if (!course) return <div className="text-center py-20 text-xl font-bold">Course not found</div>;

  const getMediaUrl = (path) => {
    if (!path) return '';
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove the trailing /api from the explicit URL if it exists, since uploads are usually at the root
    return `${API_URL.replace('/api', '')}${path}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 animate-in fade-in duration-500">
      
      {/* Course Header */}
      <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mb-8 relative border border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent z-10 hidden md:block"></div>
        <img 
          src={`https://source.unsplash.com/random/1200x400/?${course.category || 'education'}`} 
          alt="Course Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 md:opacity-100 mix-blend-overlay"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80' }}
        />
        
        <div className="relative z-20 p-8 sm:p-12 md:w-2/3 lg:w-3/5 text-white">
          <span className="inline-block px-3 py-1 bg-primary-600/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/30">
            {course.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{course.title}</h1>
          <p className="text-gray-300 text-lg mb-8 line-clamp-3">{course.description}</p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white shadow-lg">
                I
              </div>
              <div>
                <div className="text-sm text-gray-400">Instructor Account ID</div>
                <div className="font-semibold text-sm">{course.instructorId.substring(0, 8)}...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {hasPurchased ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <PlayCircle className="text-primary-500" /> Course Content
              </h2>
              
              <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 shadow-lg relative group">
                {course.videoUrl ? (
                  <video 
                    controls 
                    className="w-full h-full"
                    controlsList="nodownload"
                  >
                    <source src={getMediaUrl(course.videoUrl)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Video not available
                  </div>
                )}
              </div>

              {course.slidesUrl && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Presentation Slides</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PDF Document format</p>
                    </div>
                  </div>
                  <a 
                    href={getMediaUrl(course.slidesUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center text-gray-900 dark:text-white"
                  >
                    View Slides
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gray-100 dark:bg-gray-700 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
              
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <Lock size={36} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">Course Locked</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto relative z-10">
                You need to purchase this course to access the video material and presentation slides.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto relative z-10">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <PlayCircle size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">HD Video</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <FileText size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">PDF Slides</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <ShieldCheck size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Lifetime</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About this course</h3>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p className="whitespace-pre-line leading-relaxed">{course.description}</p>
            </div>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24">
            
            <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                ${course.price.toFixed(2)}
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-1 px-3 rounded-full inline-block">
                One-time payment
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm">
                <CheckCircle size={20} className="text-primary-500 shrink-0" />
                <span>Full lifetime access to course videos</span>
              </li>
              <li className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm">
                <CheckCircle size={20} className="text-primary-500 shrink-0" />
                <span>Downloadable PDF slides</span>
              </li>
              <li className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm">
                <CheckCircle size={20} className="text-primary-500 shrink-0" />
                <span>Access on mobile and desktop</span>
              </li>
            </ul>

            {!hasPurchased ? (
              <button 
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              >
                {purchasing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard size={22} /> Buy Now
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-4 bg-green-500/10 text-green-600 dark:text-green-400 font-bold rounded-xl text-center flex justify-center items-center gap-2 border border-green-500/20">
                <CheckCircle size={22} /> Purchased
              </div>
            )}
            
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
              Secure payment processed externally
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetail;
