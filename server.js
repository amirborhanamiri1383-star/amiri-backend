app.post("/analyze", async (req, res) => {
  try {
    const { base64 } = req.body;

    if (!base64) {
      return res.json({ success: false, error: "No image provided" });
    }

    const rawBase64 = base64.includes(",")
      ? base64.split(",")[1]
      : base64;

    const prompt = `
You are an expert plant pathologist. Analyze the plant image and return ONLY valid JSON.

The JSON schema (keys in English, values can be Persian):

{
  "diseaseName": "نام بیماری (اگر مطمئن نیستی، بنویس ناشناخته)",
  "scientificName": "نام علمی (در صورت امکان)",
  "family": "خانواده و رده‌بندی کلی",
  "affectedPart": "بخش درگیر گیاه (برگ، ساقه، ریشه، میوه، چند بخش و ...)",
  "severity": "low | medium | high",
  "description": "توضیح تخصصی درباره علائم و روند بیماری",
  "lifeCycle": "نحوه زندگی، بقا، انتشار و شرایط رشد بیماری",
  "prevention": "راهکارهای پیشگیری عمومی و ایمن",
  "treatment": "راهکارهای درمانی عمومی و ایمن (بدون ذکر دوز دقیق سموم)",
  "confidence": "درصد تقریبی اطمینان از 0 تا 100"
}

Important rules:
- Output MUST be ONLY pure JSON. No extra text.
- If you are not sure, use "ناشناخته" and lower confidence.
- Do NOT give exact pesticide dosages. Only general safe guidance.
`;

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
              text: prompt
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = await response.text();
    console.log("GEMINI RAW TEXT:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error("JSON PARSE ERROR:", e);
      return res.json({
        success: false,
        error: "Invalid JSON from model"
      });
    }

    return res.json({
      success: true,
      data: json
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.json({
      success: false,
      error: "Analysis failed"
    });
  }
});