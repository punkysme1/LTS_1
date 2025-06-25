
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { getBlogPostById, addBlogPost, updateBlogPost } from '../../services/blogService';
import LoadingSpinner from '../../components/LoadingSpinner';

// Basic WYSIWYG might be too complex for now, using textarea for content
// For a real app, consider a library like ReactQuill or TipTap

const BlogPostFormPage: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(postId);

  const initialFormState: Omit<BlogPost, 'id' | 'date' | 'comments'> = {
    title: '', author: '', excerpt: '', content: '', thumbnailUrl: ''
  };

  const [post, setPost] = useState<Omit<BlogPost, 'id' | 'date' | 'comments'>>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async (currentPostId: string) => {
    setIsLoading(true);
    try {
      const data = await getBlogPostById(currentPostId);
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, date, comments, ...formData } = data;
        setPost(formData);
      } else {
        setError('Artikel blog tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat data artikel.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEditing && postId) {
      fetchPost(postId);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, isEditing]); // fetchPost is memoized

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isEditing && postId) {
        await updateBlogPost(postId, post);
      } else {
        await addBlogPost(post);
      }
      navigate('/admin/blog');
    } catch (err) {
      setError(isEditing ? 'Gagal memperbarui artikel.' : 'Gagal menambah artikel.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100";


  if (isLoading && !post.title) return <LoadingSpinner />;
  if (error && !isEditing) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        {isEditing ? 'Edit Artikel Blog' : 'Tambah Artikel Baru'}
      </h1>
      {error && <p className="mb-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-3 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Artikel</label>
          <input type="text" name="title" id="title" value={post.title} onChange={handleChange} required className={inputStyle} />
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penulis</label>
          <input type="text" name="author" id="author" value={post.author} onChange={handleChange} required className={inputStyle} />
        </div>
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Thumbnail (Opsional)</label>
          <input type="url" name="thumbnailUrl" id="thumbnailUrl" value={post.thumbnailUrl || ''} onChange={handleChange} placeholder="https://example.com/image.jpg" className={inputStyle} />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kutipan Singkat (Excerpt)</label>
          <textarea name="excerpt" id="excerpt" value={post.excerpt} onChange={handleChange} rows={3} required className={inputStyle} />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Isi Lengkap Artikel (HTML didukung)</label>
          <textarea name="content" id="content" value={post.content} onChange={handleChange} rows={15} required className={inputStyle} />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Anda dapat menggunakan tag HTML dasar seperti &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;img src="..."&gt;, dll.</p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <Link to="/admin/blog" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Batal
          </Link>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
            {isLoading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Publikasikan Artikel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostFormPage;
