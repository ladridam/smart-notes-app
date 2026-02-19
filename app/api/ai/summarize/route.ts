import { NextRequest, NextResponse } from "next/server";
import { summarizeNote } from "@/lib/vertexai";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const summary = await summarizeNote(content);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to summarize",
      },
      { status: 500 }
    );
  }
}
