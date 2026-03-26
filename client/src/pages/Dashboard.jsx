import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuthStore } from '../store';
import { BookOpen, Video, FileText, ChevronRight, GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Load student purchases
        const purRes = await api.get('/payments/my-purchases');
        setPurchases(purRes.data);

        // Load instructor courses if applicable
        if (user.role === 'instructor') {
          const instRes = await api.get('/courses/instructor/my-courses');
          setInstructorCourses(instRes.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary-600 to-blue-800 rounded-3xl p-8 sm:p-10 mb-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-primary-100 text-lg">Ready to continue your learning journey?</p>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Student Section - My Learning */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="text-primary-600 dark:text-primary-400" size={28} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Learning</h2>
          </div>

          {purchases.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">You haven't purchased any courses yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Explore our catalog and find something new to learn.</p>
              <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 px-4 transition-colors">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => {
                const course = purchase.courseDetails;
                if (!course) return null;
                return (
                  <Link 
                    key={purchase.id} 
                    to={`/courses/${course.id}`} 
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all hover:-translate-y-1 block"
                  >
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
                      <img 
                        src={`https://source.unsplash.com/random/400x300/?${course.category || 'education'}`} 
                        alt="Course cover" 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80' }}
                      />
                      <div className="absolute bottom-3 left-4 z-20 flex gap-1 items-center">
                        <span className="bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                          Purchased
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><Video size={16} /> Course Videos</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Instructor Section */}
        {user.role === 'instructor' && (
          <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="text-amber-500" size={28} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h2>
              </div>
              <Link to="/create-course" className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                + New Course
              </Link>
            </div>

            {instructorCourses.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm border-dashed">
                <p className="text-gray-500 dark:text-gray-400">You haven't created any courses yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                      <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {instructorCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">{course.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">ID: {course.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          ${course.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/courses/${course.id}`} className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 font-semibold px-3 py-1 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                            Preview
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
