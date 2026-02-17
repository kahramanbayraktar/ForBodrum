import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const lang = formData.get("lang") as string || "en";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Analyze this image of an urban issue in Bodrum.
    Return a JSON object with the following fields:
    - title: A short title for the issue (in ${lang === 'tr' ? 'Turkish' : 'English'})
    - description: A brief description (in ${lang === 'tr' ? 'Turkish' : 'English'})
    - category: One of [Infrastructure, Cleanliness, Lighting, Traffic, Green Space]
    - severity: One of [Low, Medium, High]
    - tags: A list of 3-5 relevant hashtags (in ${lang === 'tr' ? 'Turkish' : 'English'})

    Ensure the JSON is valid and only contains these fields.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();
    
    // Clean up markdown if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    // Upload to Supabase Storage
    let imageUrl = "";
    try {
      const { uploadImage } = await import("@/lib/supabase");
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      imageUrl = await uploadImage(buffer, fileName, file.type);
    } catch (uploadError) {
      console.error("Supabase upload failed! Full error:", uploadError);
    }



    return NextResponse.json({ ...data, imageUrl });
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
