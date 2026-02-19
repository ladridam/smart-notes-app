import { NextRequest, NextResponse } from "next/server";
import { improveWriting } from "@/lib/vertexai";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const improved = await improveWriting(content);

    return NextResponse.json({
      success: true,
      data: improved,
    });
  } catch (error) {
    console.error("Improve Writing API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to improve writing",
      },
      { status: 500 }
    );
  }
}
