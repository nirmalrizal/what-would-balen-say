import type { LoaderFunctionArgs } from "react-router";
import {
  checkRateLimit,
  getClientIp,
  getSecondsUntilReset,
} from "~/lib/rate-limit.server";
import { claudeQueue, getQueueSize } from "~/lib/queue.server";
import { streamBalenResponse, MAX_QUESTION_LENGTH } from "~/lib/ai.server";
import { logQA } from "~/lib/qa-log.server";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

function sseMsg(data: string): Uint8Array {
  return new TextEncoder().encode(`data: ${data}\n\n`);
}

function sseJson(obj: unknown): Uint8Array {
  return sseMsg(JSON.stringify(obj));
}

export async function loader({ request }: LoaderFunctionArgs) {
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    const retryAfter = getSecondsUntilReset(ip);
    return new Response(
      `data: ${JSON.stringify({ error: "rate_limited", retryAfter })}\n\ndata: [DONE]\n\n`,
      { status: 429, headers: SSE_HEADERS },
    );
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return new Response(
      `data: ${JSON.stringify({ error: "empty_question" })}\n\ndata: [DONE]\n\n`,
      { status: 400, headers: SSE_HEADERS },
    );
  }

  if (q.length > MAX_QUESTION_LENGTH) {
    return new Response(
      `data: ${JSON.stringify({ error: "question_too_long", max: MAX_QUESTION_LENGTH })}\n\ndata: [DONE]\n\n`,
      { status: 400, headers: SSE_HEADERS },
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const queueSize = getQueueSize();
      if (queueSize > 0) {
        controller.enqueue(sseJson({ queue_position: queueSize }));
      }

      try {
        const tokens: string[] = [];
        await claudeQueue.add(async () => {
          await streamBalenResponse(
            q,
            (token) => {
              tokens.push(token);
              controller.enqueue(sseJson({ token }));
            },
            request.signal,
          );
        });
        controller.enqueue(sseMsg("[DONE]"));
        try {
          logQA(q, tokens.join(""), ip);
        } catch {}
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          controller.enqueue(
            sseJson({ error: "api_error", message: (err as Error)?.message }),
          );
          controller.enqueue(sseMsg("[DONE]"));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
