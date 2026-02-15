const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Gemini API Key
const apiKey = "AIzaSyCOzkZIWAiD3ttQbadSdrCELHHzhwGxXYE";
const ai = new GoogleGenAI({ apiKey });

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
          role: "user",
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
      responseMimeType: "application/json"
    });

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch (e) {
      return res.json({ success: false, error: "Invalid JSON from Gemini" });
    }

    res.json({ success: true, data: json });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ success: false, error: "Analysis failed" });
  }
});

// Railway port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});