import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();

  console.log(payload);
  return NextResponse.json({ success: "Profile created" }, { status: 201 });
}

export async function GET() {
  console.clear();
  return NextResponse.json({ message: "Why are you here?" });
}
