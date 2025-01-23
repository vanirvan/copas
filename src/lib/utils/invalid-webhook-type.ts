// this utility function purpose is only to check if the webhook type is valid or not
// suspect is user is manually accessing the route
import type { Webhook } from "@/lib/types/webhook";

const expecedTypes = ["user.created", "user.updated", "user.deleted"];

export function isValidWebhookType(webhook: Webhook) {
  return expecedTypes.includes(webhook.type);
}
