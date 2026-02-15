app.post("/analyze", async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const fakeResponse = {
      diseaseName: "بیماری تستی",
      scientificName: "Testus plantus",
      family: "Testaceae",
      affectedPart: "برگ",
      severity: "low",
      description: "این فقط یک پاسخ تستی برای بررسی ارتباط اپ و سرور است.",
      lifeCycle: "این متن فقط جهت تست است و چرخه زندگی واقعی نیست.",
      prevention: "رعایت بهداشت مزرعه، آبیاری مناسب، بررسی منظم گیاه.",
      treatment: "در این حالت نیازی به درمان واقعی نیست، چون فقط تست است.",
      confidence: 80
    };

    return res.json({
      success: true,
      data: fakeResponse
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.json({
      success: false,
      error: "Analysis failed"
    });
  }
});