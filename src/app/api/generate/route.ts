// app/api/gen-description/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const prompt = `
      Create ONE short but funny description, max 20 words, 
      from the title: "${title}".
      Do not repeat or rewrite the title.
      Do not use prefixes like "${title}:" or quotation marks.
      Just write the description content directly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // atau "gemini-2.5-flash" bila tersedia
      contents: prompt,
    });

    const rawDescription = response?.text ?? "";
    const description = rawDescription
      .replace(/^["']|["']$/g, "")
      .replace(new RegExp(`^${title}\\s*[:：-]\\s*`, "i"), "")
      .trim();

    return NextResponse.json({ description });
  } catch (err: unknown) {
    console.error("Google Gen AI error:", err);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
