```tsx
// BE
// api/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Buatkan deskripsi singkat namun lucu yang menggambarkan aktivitas terdiri dari maksimal 20 kata dari judul berikut: "${title}"`,
        },
      ],
    });

    const rawDescription =
      completion.choices[0].message?.content || "No description generated.";

    const description = rawDescription.replace(/^["']|["']$/g, "").trim();

    return NextResponse.json({ description });
  } catch (err: unknown) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
```

```tsx
// FE
// app/page.tsx
const handleGenerateDescription = async () => {
  if (!title.trim()) return;
  setLoading(true);
  try {
    const res = await fetch("/api/generate-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (data.description) {
      setDescription(data.description);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};
```
