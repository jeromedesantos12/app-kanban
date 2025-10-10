import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Buatkan deskripsi singkat namun lucu maksimal 20 kata dari judul: "${title}"`,
        },
      ],
    });

    const rawDescription = completion.choices?.[0]?.message?.content ?? "";
    const description = rawDescription.replace(/^["']|["']$/g, "").trim();

    return NextResponse.json({ description });
  } catch (error: unknown) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
