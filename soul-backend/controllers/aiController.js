import axios from "axios";

export const chatWithAI = async (req, res) => {
  const { user_id, message } = req.body;

  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/chat`,
      { user_id, message }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "AI service unavailable" });
  }
};
