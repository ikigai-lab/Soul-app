import supabase from "../config/supabaseClient.js";

export const logMood = async (req, res) => {
  const { user_id, mood_emoji, mood_name, mood_scale } = req.body;

  const { data, error } = await supabase
    .from("mood_checkins")
    .insert([{ user_id, mood_emoji, mood_name, mood_scale }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
};
