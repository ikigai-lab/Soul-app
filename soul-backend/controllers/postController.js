import supabase from "../config/supabaseClient.js";

export const getPosts = async (req, res) => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, content, created_at, profiles(display_name)")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createPost = async (req, res) => {
  const { user_id, content } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ user_id, content }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};

export const getComments = async (req, res) => {
  const { postId } = req.params;

  const { data, error } = await supabase
    .from("comments")
    .select("id, content, created_at, profiles(display_name)")
    .eq("post_id", postId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { user_id, content } = req.body;

  const { data, error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, user_id, content }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};
