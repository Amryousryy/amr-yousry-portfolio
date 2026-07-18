#!/usr/bin/env node

/**
 * Sprint 07: KPI Dashboard
 * 
 * Displays a quick-view dashboard of key platform metrics.
 * 
 * Usage:
 *   node scripts/kpi-dashboard.js
 *   npm run health:dashboard
 */

const fs = require("fs");
const path = require("path");

// Configuration
const METRICS_FILE = path.resolve(__dirname, "../docs/health-metrics.json");

// Load metrics
function loadMetrics() {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      return JSON.parse(fs.readFileSync(METRICS_FILE, "utf-8"));
    }
  } catch {}
  return null;
}

// Format number with color indicator
function formatMetric(value, target, invert = false) {
  const met = invert ? value <= target : value >= target;
  const indicator = met ? "✅" : "⚠️";
  return `${indicator} ${value}`;
}

// Main function
function main() {
  const metrics = loadMetrics();
  if (!metrics) {
    console.error("❌ No metrics found. Run 'npm run health:metrics' first.");
    process.exit(1);
  }

  const timestamp = new Date(metrics.timestamp).toLocaleString();

  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           PLATFORM HEALTH KPI DASHBOARD                    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log(`  Generated: ${timestamp}`);
  console.log("");

  // Health Score
  const scoreBar = "█".repeat(Math.floor(metrics.healthScore / 5)) + 
                   "░".repeat(20 - Math.floor(metrics.healthScore / 5));
  console.log("  🏥 HEALTH SCORE");
  console.log(`  [${scoreBar}] ${metrics.healthScore}/100`);
  console.log(`  Rating: ${metrics.healthRating}`);
  console.log("");

  // Behavior API Adoption
  console.log("  🎯 BEHAVIOR API ADOPTION");
  console.log(`  ┌─────────────────────────────────────────────┐`);
  console.log(`  │ Hook Files:        ${String(metrics.adoption.hookFiles).padStart(6)}                  │`);
  console.log(`  │ Component Files:   ${String(metrics.adoption.componentFiles).padStart(6)}                  │`);
  console.log(`  │ API Imports:       ${String(metrics.adoption.behaviorApiImports).padStart(6)}                  │`);
  console.log(`  │ API Usages:        ${String(metrics.adoption.behaviorApiUsages).padStart(6)}                  │`);
  console.log(`  └─────────────────────────────────────────────┘`);
  console.log("");

  // Compliance
  console.log("  ✅ COMPLIANCE");
  console.log(`  ┌─────────────────────────────────────────────┐`);
  console.log(`  │ Direct .animate():  ${formatMetric(metrics.adoption.directAnimate, 0, true).padEnd(20)}│`);
  console.log(`  │ Inline Animations:  ${formatMetric(metrics.adoption.inlineAnimations, 4, true).padEnd(20)}│`);
  console.log(`  │ Unauthorized Libs:  ${formatMetric(metrics.adoption.unauthorizedLibImports, 2, true).padEnd(20)}│`);
  console.log(`  └─────────────────────────────────────────────┘`);
  console.log("");

  // Exception Management
  console.log("  📋 EXCEPTION MANAGEMENT");
  console.log(`  ┌─────────────────────────────────────────────┐`);
  console.log(`  │ Total:              ${String(metrics.exceptions.total).padStart(6)}                  │`);
  console.log(`  │ Approved:           ${String(metrics.exceptions.approved).padStart(6)}                  │`);
  console.log(`  │ Pending:            ${String(metrics.exceptions.pending).padStart(6)}                  │`);
  console.log(`  │ Expired:            ${formatMetric(metrics.exceptions.expired, 0, true).padEnd(20)}│`);
  console.log(`  │ Expiring Soon:      ${formatMetric(metrics.exceptions.expiringSoon, 0, true).padEnd(20)}│`);
  console.log(`  └─────────────────────────────────────────────┘`);
  console.log("");

  // Documentation
  console.log("  📝 DOCUMENTATION");
  console.log(`  ┌─────────────────────────────────────────────┐`);
  console.log(`  │ Documentation Rate: ${formatMetric(metrics.documentation.documentationRate, 100).padEnd(20)}│`);
  console.log(`  │ With Expiration:    ${String(metrics.documentation.withExpiration).padStart(6)}                  │`);
  console.log(`  │ With Owner:         ${String(metrics.documentation.withOwner).padStart(6)}                  │`);
  console.log(`  └─────────────────────────────────────────────┘`);
  console.log("");

  // Hook Usage
  console.log("  🔧 HOOK USAGE BREAKDOWN");
  console.log(`  ┌─────────────────────────────────────────────┐`);
  for (const [hook, count] of Object.entries(metrics.adoption.hookUsageCount)) {
    const bar = "█".repeat(Math.min(count, 20));
    console.log(`  │ ${hook.padEnd(18)} ${String(count).padStart(4)} ${bar.padEnd(20)}│`);
  }
  console.log(`  └─────────────────────────────────────────────┘`);
  console.log("");

  // Footer
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Metrics collected from: docs/health-metrics.json          ║");
  console.log("║  Run: npm run health:metrics --collect                     ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log("");
}

main();
