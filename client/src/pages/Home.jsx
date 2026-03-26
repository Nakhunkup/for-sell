import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useLangStore } from '../store';
import { translations } from '../translations';
import { PlayCircle, Clock, Star, BookOpen, Users, Award } from 'lucide-react';
import DisplayCardsDemo from '../components/DisplayCardsDemo';
import UserStatsDemo from '../components/UserStatsDemo';
import { Waves } from '../components/ui/wave-background';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLangStore();
  const t = translations[lang].home;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white mb-16 shadow-2xl">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Waves strokeColor="rgba(255,255,255,0.2)" backgroundColor="#111827" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-gray-900/40 z-10 pointer-events-none"></div>

        <div className="relative z-20 px-8 py-24 sm:px-16 sm:py-32 lg:px-24 flex flex-col items-center text-center max-w-4xl mx-auto pointer-events-none">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-300 text-sm font-semibold tracking-wider mb-4 border border-primary-500/30">
            {t.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            {t.title_1} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-200">{t.title_2}</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="flex gap-4 justify-center pointer-events-auto">
            <Link to="/courses" className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-1">
              {t.btn_explore}
            </Link>
            <Link to="/register" className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold transition-all hover:-translate-y-1">
              {t.btn_join}
            </Link>
          </div>
        </div>
      </section>

      {/* Cards Section Below Hero */}
      <section className="col-span-12 flex justify-center -mt-20 relative z-30 mb-8 sm:mb-16 scale-90 sm:scale-100">
        <DisplayCardsDemo />
      </section>

      {/* Platform Statistics */}
      <section className="mb-24 px-4 sm:px-0">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-12 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/10 dark:bg-primary-900/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex-1 relative z-10 w-full">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">ร่วมเรียนรู้ไปกับเรา</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-xl">
              มีผู้เรียนและผู้เชี่ยวชาญหลายหมื่นคนกำลังใช้งานระบบของเรา ค้นพบทักษะใหม่ๆ แบ่งปันความรู้ และติดตามความคืบหน้าของคุณได้แบบเรียลไทม์
            </p>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                ชุมชนผู้เรียนที่เติบโตอย่างรวดเร็วทุกวัน
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                หลักสูตรคุณภาพสูง สอนโดยผู้เชี่ยวชาญตัวจริง
              </li>
            </ul>
          </div>
          <div className="relative w-full max-w-lg xl:w-auto shrink-0 z-10">
            {/* Glow effect behind card */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl z-0 pointer-events-none"></div>
            <div className="relative z-10">
              <UserStatsDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t.featured}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t.featured_sub}</p>
          </div>
          <Link to="/courses" className="hidden sm:flex text-primary-600 font-medium hover:text-primary-700 items-center gap-1 group">
            {t.view_all} <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.no_courses}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t.no_courses_sub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 hover-group">
            {courses.slice(0, 6).map(course => (
              <Link key={course.id} to={`/courses/${course.id}`} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all hover:-translate-y-1 flex flex-col">
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img 
                    src={course.thumbnailUrl || `https://source.unsplash.com/random/400x300/?${course.category || 'education'}`} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80' }}
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-white/20 backdrop-blur-md text-white rounded-md border border-white/20 uppercase tracking-wide">
                      {course.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold text-sm">4.8</span>
                      <span className="text-gray-400 text-xs ml-1">(120)</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${course.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
