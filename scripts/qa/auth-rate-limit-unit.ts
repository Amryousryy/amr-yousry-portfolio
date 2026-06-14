/**
 * CI-safe unit tests for the in-memory login rate limiter.
 *
 * Tests the core logic without needing any server, database, or network.
 * Uses the test style from project-readiness-unit.ts (assert/assertEq).
 */
import {
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  _resetStore,
} from "../../src/lib/auth-rate-limit";

let passed = 0;
let failed = 0;

function assert(cond: boolean, label: string): void {
  if (cond) { passed++; } else { failed++; console.log(`  FAIL: ${label}`); }
}

// ── Setup ──────────────────────────────────────────────────────────
const email = "admin@example.com";
const ip = "192.168.1.1";
const otherIp = "10.0.0.1";
const otherEmail = "other@example.com";

// ────────────────────────────────────────────────────────────────────
console.log("## Login Rate Limiter\n");

// 1. Fresh state — allowed
assert(checkRateLimit(email, ip).allowed, "fresh email+ip is allowed");

// 2. Record 4 failed attempts — still allowed
for (let i = 1; i <= 4; i++) {
  recordFailedAttempt(email, ip);
  const result = checkRateLimit(email, ip);
  assert(result.allowed, `attempt ${i}/5 — still allowed`);
}

// 3. 5th failed attempt triggers block
recordFailedAttempt(email, ip);
const blocked = checkRateLimit(email, ip);
assert(!blocked.allowed, "5th attempt — blocked");
assert(typeof blocked.retryAfterSeconds === "number", "retryAfterSeconds is a number");
assert(blocked.retryAfterSeconds! > 0, "retryAfterSeconds is positive");

// 4. Different email, same IP — unaffected
assert(checkRateLimit(otherEmail, ip).allowed, "different email, same IP — allowed");

// 5. Same email, different IP — unaffected
assert(checkRateLimit(email, otherIp).allowed, "same email, different IP — allowed");

// 6. Different email, different IP — unaffected
assert(checkRateLimit(otherEmail, otherIp).allowed, "different email, different IP — allowed");

// 7. Clear failed attempts — allowed again
clearFailedAttempts(email, ip);
assert(checkRateLimit(email, ip).allowed, "after clear — allowed");

// 8. Email normalization — case insensitive
_resetStore();
const mixedCase = "Admin@Example.Com";
for (let i = 0; i < 5; i++) {
  recordFailedAttempt(mixedCase, ip);
}
assert(!checkRateLimit(email, ip).allowed, "case-insensitive normalization — blocked");

// 9. Re-block after reset
_resetStore();
for (let i = 0; i < 5; i++) {
  recordFailedAttempt(email, ip);
}
assert(!checkRateLimit(email, ip).allowed, "re-blocked after reset");

// ── Summary ─────────────────────────────────────────────────────────
console.log(`\nPassed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
