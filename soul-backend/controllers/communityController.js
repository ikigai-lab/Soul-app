import supabase from "../config/supabaseClient.js";

export const getCommunities = async (req, res) => {
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, description, created_at");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const createCommunity = async (req, res) => {
  const { owner_id, name, description } = req.body;

  const { data, error } = await supabase
    .from("communities")
    .insert([{ owner_id, name, description }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};
