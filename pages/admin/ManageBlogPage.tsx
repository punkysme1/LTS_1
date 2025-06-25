
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { getBlogPosts, deleteBlogPost, getAllCommentsForPost } from '../../services/blogService';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

interface BlogPostWithCommentCount extends BlogPost {
  approvedCommentCount: number;
  totalCommentCount: number;
}

const ManageBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostWithCommentCount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchPosts = useCallback(async (page: number) => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      const { data, totalPages: newTotalPages } = await getBlogPosts(page);
      
      const postsWithCounts = await Promise.all(data.map(async (post) => {
        // The getBlogPosts now already fetches approved comments as post.comments
        // If we need total count (approved + unapproved) for admin, we'd call getAllCommentsForPost
        const allComments = await getAllCommentsForPost(post.id);
        return {
          ...post,
          approvedCommentCount: post.comments.length, // Already filtered by getBlogPosts
          totalCommentCount: allComments.length,
        };
      }));

      setPosts(postsWithCounts);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      setFeedbackMessage("Gagal memuat artikel blog.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"? Ini juga akan menghapus semua komentarnya.`)) {
      setIsLoading(true);
      try {
        await deleteBlogPost(id);
        setFeedbackMessage(`Artikel "${title}" berhasil dihapus.`);
        fetchPosts(currentPage); // Refresh list
      } catch (error) {
        console.error("Failed to delete blog post:", error);
        setFeedbackMessage("Gagal menghapus artikel.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Kelola Artikel Blog</h1>
        <Link 
          to="/admin/blog/new" 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Tambah Artikel Baru
        </Link>
      </div>

      {feedbackMessage && (
        <div className={`p-3 mb-4 rounded-md ${feedbackMessage.includes('berhasil') ? 'bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-200'}`}>
          {feedbackMessage}
        </div>
      )}
      
      {isLoading && posts.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-4">Belum ada artikel blog.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Judul</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Penulis</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Komentar (Appr/Total)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{post.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{post.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(post.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{post.approvedCommentCount}/{post.totalCommentCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link to={`/admin/blog/edit/${post.id}`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">Edit</Link>
                        <button onClick={() => handleDelete(post.id, post.title)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">Hapus</button>
                        {/* Consider a link to a new page for managing comments of a specific post */}
                        {/* <Link to={`/admin/blog/${post.id}/comments`} className="text-indigo-600 hover:text-indigo-800">Komentar</Link> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ManageBlogPage;