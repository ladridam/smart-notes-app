import { NextRequest, NextResponse } from "next/server";
import { extractActionItems } from "@/lib/vertexai";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const actionItems = await extractActionItems(content);

    return NextResponse.json({
      success: true,
      data: actionItems,
    });
  } catch (error) {
    console.error("Action Items API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to extract action items",
      },
      { status: 500 }
    );
  }
}
