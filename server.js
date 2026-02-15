const express = require("express");
const cors = require("cors");
const { GoogleGenAI, Type } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// اینجا کلید Gemini خودت رو بذار
const apiKey = "اینجا_کلید_تو";

const ai = new GoogleGenAI({ apiKey });

app.post("/analyze", async (req, res) => {
  try {
    const { base64 } = req.body;

    const rawBase64 = base64.split(",")[1];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: rawBase64
            }
          },
          { text: "Analyze this plant disease and return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json({ success: true, data: JSON.parse(response.text) });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Analysis failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});