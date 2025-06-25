
import React, { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '../types';
import { getBlogPosts } from '../services/blogService';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPosts = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const { data, totalPages: newTotalPages, totalItems: newTotalItems } = await getBlogPosts(page);
      setPosts(data);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
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

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Blog & Artikel</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {posts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 text-xl">Belum ada artikel yang dipublikasikan.</p>
          ) : (
             <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                Menampilkan {posts.length} dari {totalItems} artikel.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPage;
