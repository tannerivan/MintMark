/**
 * MintMark™ Clerk Webhook Handler
 * POST /api/webhooks/clerk
 *
 * Keeps our User table in sync with Clerk as the auth source of truth.
 * Called by Clerk when users are created, updated, or deleted.
 *
 * Why svix? Clerk signs every webhook payload. We verify the signature
 * before touching the DB — without this, anyone could POST fake events.
 *
 * Setup: In Clerk dashboard → Webhooks → create endpoint pointing to
 * https://yourdomain.com/api/webhooks/clerk, subscribe to:
 *   user.created, user.updated, user.deleted
 * Copy the signing secret to CLERK_WEBHOOK_SECRET in .env.local
 */

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
  };
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[MintMark] CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Verify signature
  const svix_id        = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(body, {
      "svix-id":        svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  // Find primary email
  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  )?.email_address ?? data.email_addresses[0]?.email_address;

  try {
    if (type === "user.created") {
      await prisma.user.create({
        data: {
          id: data.id,
          email: primaryEmail ?? `${data.id}@unknown.mintmark`,
        },
      });
    } else if (type === "user.updated") {
      await prisma.user.upsert({
        where:  { id: data.id },
        update: { email: primaryEmail ?? "" },
        create: {
          id:    data.id,
          email: primaryEmail ?? `${data.id}@unknown.mintmark`,
        },
      });
    } else if (type === "user.deleted") {
      // Cascade delete is set on the schema — lookups and saved coins go too
      await prisma.user.delete({ where: { id: data.id } }).catch(() => {
        // User may not exist in our DB (e.g. deleted before completing signup)
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[MintMark] Clerk webhook DB error (${type}):`, err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
