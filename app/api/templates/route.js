import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
try {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key) {
    const template = await db.resumeTemplate.findUnique({
      where: { key },
    });
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json(template);
  }

  const templates = await db.resumeTemplate.findMany({
    orderBy: { id: "asc" },
  });
  return NextResponse.json(templates);
  } catch (error) {
       console.error('Error fetching template posts:', error);
       return NextResponse.json(
         {
           success: false,
           error: 'Failed to fetch template posts'
         },
         { status: 500 }
       );
     }
}
