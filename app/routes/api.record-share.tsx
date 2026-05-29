import type { ActionFunctionArgs } from "react-router";
import { recordShare } from "~/lib/shares.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const { question, answer } = (await request.json()) as {
      question: string;
      answer: string;
    };
    if (typeof question === "string" && typeof answer === "string") {
      recordShare(question.slice(0, 500), answer.slice(0, 500));
    }
  } catch {
    // non-critical — silently ignore malformed requests
  }
  return new Response(null, { status: 204 });
}
