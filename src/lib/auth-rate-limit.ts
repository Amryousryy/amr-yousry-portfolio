/**
 * In-memory login rate limiter.
 *
 * Keyed by normalized email + client IP.
 * After MAX_ATTEMPTS failures within WINDOW_MS, blocks for BLOCK_DURATION_MS.
 * Successful login clears only that email+IP key.
 *
 * Serverless note: Each Lambda instance has its own memory, so this is a
 * defense-in-depth layer, not a hard guarantee against distributed attacks.
 * For production-grade cross-instance enforcement, swap the store for a
 * MongoDB-backed or Redis-backed implementation.
 */

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
  blockedUntil: number | null;
}

const store = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

function normalizedKey(email: string, ip: string): string {
  return `${email.trim().toLowerCase()}:${ip}`;
}

function prune(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.blockedUntil && now >= entry.blockedUntil) {
      store.delete(key);
    } else if (now - entry.firstAttemptAt > WINDOW_MS + BLOCK_DURATION_MS) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkRateLimit(email: string, ip: string): RateLimitResult {
  prune();
  const key = normalizedKey(email, ip);
  const entry = store.get(key);
  if (!entry) return { allowed: true };

  if (entry.blockedUntil) {
    const remaining = entry.blockedUntil - Date.now();
    if (remaining > 0) {
      return { allowed: false, retryAfterSeconds: Math.ceil(remaining / 1000) };
    }
    store.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(email: string, ip: string): void {
  prune();
  const key = normalizedKey(email, ip);
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now - existing.firstAttemptAt > WINDOW_MS) {
    store.set(key, { count: 1, firstAttemptAt: now, blockedUntil: null });
    return;
  }

  existing.count += 1;
  if (existing.count >= MAX_ATTEMPTS) {
    existing.blockedUntil = now + BLOCK_DURATION_MS;
  }
}

export function clearFailedAttempts(email: string, ip: string): void {
  const key = normalizedKey(email, ip);
  store.delete(key);
}

/**
 * Exposed for testing — resets all state.
 */
export function _resetStore(): void {
  store.clear();
}
