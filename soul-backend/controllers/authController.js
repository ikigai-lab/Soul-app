import supabase from "../config/supabaseClient.js";

export const signupUser = async (req, res) => {
  const { email, password, displayName } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName }
    }
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
};
