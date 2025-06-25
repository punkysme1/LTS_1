
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost as BlogPostType, Comment } from '../types';
import { getBlogPostById } from '../services/blogService';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogPostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (postId) {
      setIsLoading(true);
      try {
        const data = await getBlogPostById(postId);
        setPost(data || null);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setIsLoading(false);
      }
    }
  },[postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleCommentAdded = (newComment: Comment) => {
    // Refetch post or update locally to show new (pending) comment
    // For simplicity, refetching:
    fetchPost(); 
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Artikel tidak ditemukan.</h2>
        <Link to="/blog" className="mt-4 inline-block text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
          Kembali ke Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Oleh {post.author} - {new Date(post.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      {post.thumbnailUrl && (
        <img 
          src={post.thumbnailUrl} 
          alt={post.title} 
          className="w-full h-auto max-h-96 object-cover rounded-md shadow-md mb-8"
        />
      )}

      <div 
        className="prose dark:prose-invert max-w-none prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <CommentSection postId={post.id} comments={post.comments} onCommentAdded={handleCommentAdded} />

      <div className="mt-12 text-center">
        <Link 
          to="/blog" 
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Kembali ke Daftar Artikel
        </Link>
      </div>
    </article>
  );
};

export default BlogPostDetailPage;
