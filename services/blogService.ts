
import { BlogPost, Comment } from '../types';
import { supabase } from './supabaseClient';

const BLOG_POSTS_TABLE = 'blog_posts';
const COMMENTS_TABLE = 'comments';
const ITEMS_PER_PAGE = 5;

export const getBlogPosts = async (page: number = 1): Promise<{ data: BlogPost[], totalPages: number, totalItems: number }> => {
  const { data, error, count } = await supabase
    .from(BLOG_POSTS_TABLE)
    .select('*', { count: 'exact' })
    .order('date', { ascending: false }) // Or 'created_at'
    .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
  
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Fetch comments separately or adjust RLS and query to join
  const postsWithComments = await Promise.all(
    (data || []).map(async (post) => {
      const { data: commentsData, error: commentsError } = await supabase
        .from(COMMENTS_TABLE)
        .select('*')
        .eq('post_id', post.id)
        .eq('isApproved', true) // Only approved comments for public view
        .order('date', { ascending: true }); // Or 'created_at'
      
      if (commentsError) {
        console.error(`Error fetching comments for post ${post.id}:`, commentsError);
        return { ...post, comments: [] };
      }
      return { ...post, comments: commentsData || [] };
    })
  );

  return { data: postsWithComments as BlogPost[], totalPages, totalItems };
};

export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  const { data: postData, error: postError } = await supabase
    .from(BLOG_POSTS_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (postError) {
    if (postError.code === 'PGRST116') return undefined;
    console.error("Error fetching blog post by ID:", postError);
    throw postError;
  }
  if (!postData) return undefined;

  // Fetch all comments for this post (admin might see unapproved ones, or filter later)
  // For detail page, we usually show approved ones. If admin needs all, adjust.
  const { data: commentsData, error: commentsError } = await supabase
    .from(COMMENTS_TABLE)
    .select('*')
    .eq('post_id', postData.id)
    .order('date', { ascending: true });

  if (commentsError) {
    console.error(`Error fetching comments for post ${postData.id}:`, commentsError);
    // return post with empty comments or throw
  }

  return { ...postData, comments: commentsData || [] } as BlogPost;
};

export const addBlogPost = async (post: Omit<BlogPost, 'id' | 'date' | 'comments'>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from(BLOG_POSTS_TABLE)
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error("Error adding blog post:", error);
    throw error;
  }
  if (!data) throw new Error("Failed to add blog post, no data returned.");
  return { ...data, comments: [] } as BlogPost; // New post has no comments initially
};

export const updateBlogPost = async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'date' | 'comments'>>): Promise<BlogPost | undefined> => {
  const { data, error } = await supabase
    .from(BLOG_POSTS_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
  // Comments are not updated here, they are managed separately
  if (!data) return undefined;
  // Refetch comments if necessary or assume they are managed elsewhere
  const { data: commentsData } = await supabase.from(COMMENTS_TABLE).select('*').eq('post_id', data.id);
  return { ...data, comments: commentsData || [] } as BlogPost;
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  // Consider cascade delete for comments in Supabase or delete them manually here
  const { error: commentError } = await supabase.from(COMMENTS_TABLE).delete().eq('post_id', id);
  if (commentError) {
      console.error("Error deleting comments for blog post:", commentError);
      // Decide if this should prevent post deletion
  }

  const { error } = await supabase
    .from(BLOG_POSTS_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
  return !error;
};

export const addComment = async (postId: string, comment: Omit<Comment, 'id' | 'date' | 'isApproved' | 'postId'>): Promise<Comment | undefined> => {
  const commentData = {
    ...comment,
    post_id: postId,
    isApproved: false, // Comments need approval by default
  };
  const { data, error } = await supabase
    .from(COMMENTS_TABLE)
    .insert([commentData])
    .select()
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
  return data as Comment || undefined;
};

export const approveComment = async (commentId: string): Promise<boolean> => { // postId not strictly needed if commentId is unique
  const { error } = await supabase
    .from(COMMENTS_TABLE)
    .update({ isApproved: true })
    .eq('id', commentId);

  if (error) {
    console.error("Error approving comment:", error);
    throw error;
  }
  return !error;
};

// Admin function to get all comments for a post, including unapproved
export const getAllCommentsForPost = async (postId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .select('*')
        .eq('post_id', postId)
        .order('date', { ascending: false });
    if (error) {
        console.error("Error fetching all comments for post:", error);
        return [];
    }
    return data || [];
};


export const deleteComment = async (commentId: string): Promise<boolean> => { // postId not strictly needed
  const { error } = await supabase
    .from(COMMENTS_TABLE)
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
  return !error;
};
