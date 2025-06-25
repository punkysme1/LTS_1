
import React, { useState } from 'react';
import { Comment } from '../types';
import { addComment } from '../services/blogService'; // Assuming you have this service

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void; // Callback to update parent state
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onCommentAdded }) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !authorName.trim()) {
      setError("Nama dan isi komentar tidak boleh kosong.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const addedComment = await addComment(postId, { author: authorName, text: newCommentText });
      if (addedComment) {
        onCommentAdded(addedComment); // Update parent state
        setNewCommentText('');
        setAuthorName('');
        setSuccessMessage("Komentar Anda telah dikirim dan menunggu moderasi.");
      } else {
        setError("Gagal mengirim komentar. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim komentar.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const approvedComments = comments.filter(comment => comment.isApproved);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Komentar ({approvedComments.length})</h3>
      
      {/* Form Tambah Komentar */}
      <form onSubmit={handleSubmitComment} className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Tinggalkan Komentar</h4>
        {error && <p className="mb-3 text-red-600 dark:text-red-400">{error}</p>}
        {successMessage && <p className="mb-3 text-green-600 dark:text-green-400">{successMessage}</p>}
        <div className="mb-4">
          <label htmlFor="commentAuthor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
          <input
            type="text"
            id="commentAuthor"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Komentar</label>
          <textarea
            id="commentText"
            rows={4}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
      </form>

      {/* Daftar Komentar */}
      {approvedComments.length > 0 ? (
        <div className="space-y-6">
          {approvedComments.map((comment) => (
            <div key={comment.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{comment.author}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {new Date(comment.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
      )}
    </div>
  );
};

export default CommentSection;
