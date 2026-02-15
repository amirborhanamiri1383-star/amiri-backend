const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Gemini API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY || "AIzaSyCOzkZIWAiD3ttQbadSdrCELHHzhwGxXYE"
});

app.post("/analyze", async (req, res) => {
  try {
    const { base64 } = req.body;

    if (!base64) {
      return res.json({ success: false, error: "No image provided" });
    }

    const rawBase64 = base64.includes(",")
      ? base64.split(",")[1]
      : base64;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: rawBase64
              }
            },
            {
              text: "Analyze this plant disease and return JSON only."
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = await response.text();
    const json = JSON.parse(text);

    res.json({ success: true, data: json });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ success: false, error: "Analysis failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});