
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl">
      {post.thumbnailUrl && (
        <Link to={`/blog/${post.id}`}>
          <img 
            src={post.thumbnailUrl} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-2 text-primary-700 dark:text-primary-400 hover:underline">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Oleh {post.author} - {new Date(post.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        <Link 
          to={`/blog/${post.id}`} 
          className="self-start text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 font-semibold transition-colors"
        >
          Baca Selengkapnya &rarr;
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
