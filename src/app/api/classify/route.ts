import { NextRequest, NextResponse } from "next/server";
import { classifyDispute } from "@/lib/gemini";
import type { DisputeRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: DisputeRequest = await request.json();

    // Validate required fields
    if (
      !body.transactionId ||
      !body.cardholderId ||
      !body.amount ||
      !body.currency ||
      !body.transactionDate ||
      !body.disputeDate ||
      !body.disputeReason ||
      !body.merchantCategoryCode ||
      !body.merchantName
    ) {
      return NextResponse.json(
        { error: "Missing required fields. Please fill in all required fields." },
        { status: 400 }
      );
    }

    const result = await classifyDispute(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Classification error:", error);
    const message =
      error instanceof Error ? error.message : "Classification failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}