import { BlogPost, Comment } from '../types';
import { supabase } from './supabaseClient';

const BLOG_POSTS_TABLE = 'blog_posts';
const COMMENTS_TABLE = 'comments';
const ITEMS_PER_PAGE = 5;

export const getBlogPosts = async (page: number = 1): Promise<{ data: BlogPost[], totalPages: number, totalItems: number }> => {
  const { data, error, count } = await supabase
    .from(BLOG_POSTS_TABLE)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
  
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const postsWithComments = await Promise.all(
    (data || []).map(async (post) => {
      const { data: commentsData, error: commentsError } = await supabase
        .from(COMMENTS_TABLE)
        .select('*')
        .eq('post_id', post.id)
        // PERBAIKAN: Menggunakan is_approved sesuai petunjuk error
        .eq('is_approved', true) 
        .order('created_at', { ascending: true });
      
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

  const { data: commentsData, error: commentsError } = await supabase
    .from(COMMENTS_TABLE)
    .select('*')
    .eq('post_id', postData.id)
    .order('created_at', { ascending: true });

  if (commentsError) {
    console.error(`Error fetching comments for post ${postData.id}:`, commentsError);
  }

  return { ...postData, comments: commentsData || [] } as BlogPost;
};

export const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'comments'>): Promise<BlogPost> => {
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
  return { ...data, comments: [] } as BlogPost;
};

export const updateBlogPost = async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'comments'>>): Promise<BlogPost | undefined> => {
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
  if (!data) return undefined;
  
  const { data: commentsData } = await supabase.from(COMMENTS_TABLE).select('*').eq('post_id', data.id);
  return { ...data, comments: commentsData || [] } as BlogPost;
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  const { error: commentError } = await supabase.from(COMMENTS_TABLE).delete().eq('post_id', id);
  if (commentError) {
      console.error("Error deleting comments for blog post:", commentError);
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

export const addComment = async (postId: string, comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'is_approved' | 'post_id'>): Promise<Comment | undefined> => {
  const commentData = {
    ...comment,
    post_id: postId,
    // PERBAIKAN: Menggunakan is_approved sesuai nama kolom database
    is_approved: false, 
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

export const approveComment = async (commentId: string): Promise<boolean> => {
  const { error } = await supabase
    .from(COMMENTS_TABLE)
    // PERBAIKAN: Menggunakan is_approved sesuai nama kolom database
    .update({ is_approved: true })
    .eq('id', commentId);

  if (error) {
    console.error("Error approving comment:", error);
    throw error;
  }
  return !error;
};

export const getAllCommentsForPost = async (postId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching all comments for post:", error);
        return [];
    }
    return data || [];
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
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
