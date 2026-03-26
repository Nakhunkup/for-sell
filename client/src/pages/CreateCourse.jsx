import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Upload, Video, FileText, PlusCircle, AlertCircle } from 'lucide-react';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  
  const [files, setFiles] = useState({ video: null, slides: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Physics', 'Chemistry', 'Biology', 'Computer', 'Networking'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (files.video) data.append('video', files.video);
      if (files.slides) data.append('slides', files.slides);

      await api.post('/courses', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden text-gray-900 dark:text-gray-100">
        <div className="bg-primary-600 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle size={24} /> Create New Course
          </h1>
          <p className="text-primary-100 mt-1 opacity-90">Share your knowledge with the world.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 animate-in fade-in">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1.5" htmlFor="title">Course Title</label>
              <input 
                id="title"
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 transition-colors" 
                required 
                placeholder="e.g. Advanced Networking Configuration"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" htmlFor="description">Course Description</label>
              <textarea 
                id="description"
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 transition-colors min-h-[120px]" 
                required 
                placeholder="What will students learn?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor="price">Price ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input 
                    id="price"
                    name="price" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={formData.price} 
                    onChange={handleChange} 
                    className="w-full pl-8 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 transition-colors" 
                    required 
                    placeholder="99.99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor="category">Category</label>
                <select 
                  id="category"
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 transition-colors" 
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Video className="mx-auto text-primary-500 mb-2" size={32} />
                <label className="block text-sm font-semibold mb-2 cursor-pointer text-primary-600 hover:text-primary-700">
                  Upload Video Lesson (MP4)
                  <input 
                    type="file" 
                    name="video" 
                    accept="video/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    required 
                  />
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {files.video ? files.video.name : 'No file chosen'}
                </span>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <FileText className="mx-auto text-blue-500 mb-2" size={32} />
                <label className="block text-sm font-semibold mb-2 cursor-pointer text-blue-600 hover:text-blue-700">
                  Upload Presentation (PDF)
                  <input 
                    type="file" 
                    name="slides" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    required 
                  />
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {files.slides ? files.slides.name : 'No file chosen'}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Upload size={18} />
                  Publish Course
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
