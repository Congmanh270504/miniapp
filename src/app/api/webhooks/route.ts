import { createUser } from "@/lib/actions/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!secret) return new Response("Missing secret", { status: 500 });

    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      try {
        if (!first_name || !last_name) {
          console.error("No first name or last name found in webhook data");
          return new Response("No first name or last name found", {
            status: 400,
          });
        }
        await createUser({
          id,
          email_addresses: email_addresses[0].email_address,
          first_name,
          last_name,
          image_url,
        });
        return new Response("User created successfully", { status: 200 });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }
    if (evt.type === "user.deleted") {
      console.log("user.deleted");
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
