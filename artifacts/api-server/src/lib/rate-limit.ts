import type { Request, Response, NextFunction } from "express";

interface RateEntry {
  count: number;
  resetAt: number;
}

const FREE_LIMIT = 100;
const PRO_LIMIT = 2000;
const WINDOW_MS = 24 * 60 * 60 * 1000;

const store = new Map<string, RateEntry>();

const PRO_KEYS = new Set(
  (process.env["ARBILINK_PRO_KEYS"] ?? "").split(",").filter(Boolean)
);

function resolveKey(req: Request): { storeKey: string; limit: number; isPro: boolean } {
  const rawAuth = req.headers["x-api-key"] as string | undefined
    ?? (req.headers["authorization"] as string | undefined)?.replace(/^Bearer\s+/i, "");

  if (rawAuth && PRO_KEYS.has(rawAuth)) {
    return { storeKey: `pro:${rawAuth}`, limit: PRO_LIMIT, isPro: true };
  }

  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()
    ?? req.ip
    ?? req.socket.remoteAddress
    ?? "unknown";

  return { storeKey: `ip:${ip}`, limit: FREE_LIMIT, isPro: false };
}

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const { storeKey, limit, isPro } = resolveKey(req);

  const entry: RateEntry = store.get(storeKey) ?? { count: 0, resetAt: now + WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }

  entry.count++;
  store.set(storeKey, entry);

  const remaining = Math.max(0, limit - entry.count);
  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));
  if (isPro) res.setHeader("X-ArbiLink-Plan", "pro");

  if (entry.count > limit) {
    res.status(429).json({
      error: "rate_limit_exceeded",
      message: `Free tier: ${FREE_LIMIT} requests/day per IP. Upgrade to Pro for ${PRO_LIMIT} requests/day.`,
      limit,
      resetAt: new Date(entry.resetAt).toISOString(),
      upgrade: "https://arbi-link-challenge.replit.app",
    });
    return;
  }

  next();
}
