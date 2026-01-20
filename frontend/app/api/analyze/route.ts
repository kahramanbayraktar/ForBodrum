import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Analyze this image of an urban issue in Bodrum. 
    Return a JSON object with the following fields:
    - title: A short, descriptive title (e.g., "Deep Pothole", "Overflowing Trash").
    - category: One of ["Infrastructure", "Environment", "Transportation", "Social", "Other"].
    - severity: One of ["Low", "Medium", "High", "Critical"].
    - description: A brief description of the problem (max 2 sentences).
    - detectedTags: An array of 3-5 keywords describing the visual content.
    
    Ensure the output is pure JSON without markdown code blocks.`;

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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
