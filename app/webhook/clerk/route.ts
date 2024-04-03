import { db } from "@/db";
import { preference } from "@/db/drizzle/schema";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();

  const payloadId = payload.data.id;

  if (!payloadId)
    return NextResponse.json(
      { error: "An unexpected error occured while creating new profile" },
      { status: 400 },
    );

  console.log(payloadId);

  await db.insert(preference).values({ userId: payloadId });
  return NextResponse.json({ success: "Profile created" }, { status: 201 });
}

export async function GET() {
  console.log("Endpoint Hit");
  return NextResponse.json({ message: "Why are you here?" });
}
