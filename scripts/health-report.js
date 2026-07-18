#!/usr/bin/env node

/**
 * Sprint 07: Platform Health Report Generator
 * 
 * Generates a detailed health report from collected metrics.
 * Compares current state against baselines and targets.
 * 
 * Usage:
 *   node scripts/health-report.js
 *   npm run health:report
 */

const fs = require("fs");
const path = require("path");

// Configuration
const METRICS_FILE = path.resolve(__dirname, "../docs/health-metrics.json");
const REPORT_FILE = path.resolve(__dirname, "../docs/HEALTH-REPORT.md");

// Baselines and targets
const BASELINES = {
  adoption: {
    directAnimate: 0,
    inlineAnimations: 0,
    unauthorizedLibImports: 0,
    behaviorApiUsages: 5,
  },
  exceptions: {
    total: 10,
    expired: 0,
    expiringSoon: 0,
  },
  codeQuality: {
    ariaAttributes: 50,
    roleAttributes: 10,
  },
  documentation: {
    documentationRate: 100,
  },
};

const TARGETS = {
  healthScore: 95,
  behaviorApiUsages: 20,
  documentationRate: 100,
  exceptionExpiration: 0,
};

// Load metrics
function loadMetrics() {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      return JSON.parse(fs.readFileSync(METRICS_FILE, "utf-8"));
    }
  } catch {}
  return null;
}

// Compare against baseline
function compareBaseline(current, baseline, metric) {
  if (current === baseline) return "MET";
  if (current < baseline) return "EXCEEDED";
  return "NOT MET";
}

// Generate trend indicator
function getTrend(current, baseline) {
  if (current === baseline) return "→";
  if (current < baseline) return "↓";
  return "↑";
}

// Generate report
function generateReport(metrics) {
  const timestamp = new Date(metrics.timestamp).toLocaleString();
  
  let report = `# PLATFORM HEALTH REPORT

**Generated:** ${timestamp}  
**Health Score:** ${metrics.healthScore}/100 (${metrics.healthRating})  
**Status:** ${metrics.healthScore >= 80 ? "✅ Healthy" : "⚠️ Needs Attention"}

---

## Executive Summary

| Metric | Value | Status |
|---|---|---|
| Health Score | ${metrics.healthScore}/100 | ${metrics.healthRating} |
| Behavior API Usages | ${metrics.adoption.behaviorApiUsages} | ${metrics.adoption.behaviorApiUsages >= TARGETS.behaviorApiUsages ? "✅" : "⚠️"} |
| Direct .animate() Calls | ${metrics.adoption.directAnimate} | ${metrics.adoption.directAnimate === 0 ? "✅" : "⚠️"} |
| Unauthorized Library Usage | ${metrics.adoption.unauthorizedLibImports} | ${metrics.adoption.unauthorizedLibImports === 0 ? "✅" : "⚠️"} |
| Documentation Rate | ${metrics.documentation.documentationRate}% | ${metrics.documentation.documentationRate >= 100 ? "✅" : "⚠️"} |
| Expired Exceptions | ${metrics.exceptions.expired} | ${metrics.exceptions.expired === 0 ? "✅" : "⚠️"} |

---

## 1. Behavior API Adoption

### Overview

| Metric | Value |
|---|---|
| Hook Files | ${metrics.adoption.hookFiles} |
| Component Files | ${metrics.adoption.componentFiles} |
| Behavior API Imports | ${metrics.adoption.behaviorApiImports} |
| Behavior API Usages | ${metrics.adoption.behaviorApiUsages} |

### Hook Usage Breakdown

| Hook | Usages |
|---|---|
`;

  for (const [hook, count] of Object.entries(metrics.adoption.hookUsageCount)) {
    report += `| ${hook} | ${count} |\n`;
  }

  report += `
### Compliance

| Check | Count | Status |
|---|---|---|
| Direct .animate() Calls | ${metrics.adoption.directAnimate} | ${metrics.adoption.directAnimate === 0 ? "✅ Compliant" : "⚠️ Non-compliant"} |
| Inline Animations | ${metrics.adoption.inlineAnimations} | ${metrics.adoption.inlineAnimations <= 4 ? "✅ Acceptable" : "⚠️ Review needed"} |
| Unauthorized Library Usage | ${metrics.adoption.unauthorizedLibImports} | ${metrics.adoption.unauthorizedLibImports <= 2 ? "✅ Exception managed" : "⚠️ Review needed"} |

---

## 2. Exception Management

### Overview

| Metric | Value |
|---|---|
| Total Exceptions | ${metrics.exceptions.total} |
| Approved | ${metrics.exceptions.approved} |
| Pending | ${metrics.exceptions.pending} |
| Expired | ${metrics.exceptions.expired} |
| Expiring Soon | ${metrics.exceptions.expiringSoon} |

### Health Indicators

- ${metrics.exceptions.expired === 0 ? "✅ No expired exceptions" : `⚠️ ${metrics.exceptions.expired} expired exception(s) need review`}
- ${metrics.exceptions.expiringSoon === 0 ? "✅ No exceptions expiring soon" : `⚠️ ${metrics.exceptions.expiringSoon} exception(s) expiring within 30 days`}
- ${metrics.exceptions.pending === 0 ? "✅ No pending exceptions" : `⏳ ${metrics.exceptions.pending} exception(s) pending approval`}

---

## 3. Code Quality

### Component Architecture

| Metric | Value |
|---|---|
| Client Components | ${metrics.codeQuality.clientComponents} |
| Server Components | ${metrics.codeQuality.serverComponents} |
| Total Components | ${metrics.codeQuality.clientComponents + metrics.codeQuality.serverComponents} |

### Accessibility

| Metric | Value | Target |
|---|---|---|
| ARIA Attributes | ${metrics.codeQuality.ariaAttributes} | ≥${BASELINES.codeQuality.ariaAttributes} |
| Role Attributes | ${metrics.codeQuality.roleAttributes} | ≥${BASELINES.codeQuality.roleAttributes} |

---

## 4. Documentation

### Coverage

| Metric | Value | Target |
|---|---|---|
| Total Exceptions | ${metrics.documentation.totalExceptions} | - |
| Documented | ${metrics.documentation.documented} | ${metrics.documentation.totalExceptions} |
| With Expiration | ${metrics.documentation.withExpiration} | - |
| With Owner | ${metrics.documentation.withOwner} | ${metrics.documentation.totalExceptions} |
| Documentation Rate | ${metrics.documentation.documentationRate}% | ${TARGETS.documentationRate}% |

---

## 5. KPI Dashboard

### Current Status

| KPI | Current | Target | Status |
|---|---|---|---|
| Health Score | ${metrics.healthScore} | ≥${TARGETS.healthScore} | ${metrics.healthScore >= TARGETS.healthScore ? "✅" : "⚠️"} |
| Behavior API Usages | ${metrics.adoption.behaviorApiUsages} | ≥${TARGETS.behaviorApiUsages} | ${metrics.adoption.behaviorApiUsages >= TARGETS.behaviorApiUsages ? "✅" : "⚠️"} |
| Direct .animate() | ${metrics.adoption.directAnimate} | 0 | ${metrics.adoption.directAnimate === 0 ? "✅" : "⚠️"} |
| Documentation Rate | ${metrics.documentation.documentationRate}% | ${TARGETS.documentationRate}% | ${metrics.documentation.documentationRate >= TARGETS.documentationRate ? "✅" : "⚠️"} |
| Expired Exceptions | ${metrics.exceptions.expired} | 0 | ${metrics.exceptions.expired === 0 ? "✅" : "⚠️"} |

### Recommendations

`;

  // Generate recommendations
  const recommendations = [];

  if (metrics.adoption.directAnimate > 0) {
    recommendations.push({
      priority: "HIGH",
      action: `Migrate ${metrics.adoption.directAnimate} direct .animate() call(s) to Behavior API`,
    });
  }

  if (metrics.adoption.behaviorApiUsages < TARGETS.behaviorApiUsages) {
    recommendations.push({
      priority: "MEDIUM",
      action: `Increase Behavior API usage from ${metrics.adoption.behaviorApiUsages} to ${TARGETS.behaviorApiUsages}`,
    });
  }

  if (metrics.exceptions.expired > 0) {
    recommendations.push({
      priority: "HIGH",
      action: `Review ${metrics.exceptions.expired} expired exception(s)`,
    });
  }

  if (metrics.exceptions.expiringSoon > 0) {
    recommendations.push({
      priority: "MEDIUM",
      action: `Review ${metrics.exceptions.expiringSoon} exception(s) expiring within 30 days`,
    });
  }

  if (metrics.documentation.documentationRate < TARGETS.documentationRate) {
    recommendations.push({
      priority: "LOW",
      action: `Improve documentation rate from ${metrics.documentation.documentationRate}% to ${TARGETS.documentationRate}%`,
    });
  }

  if (recommendations.length === 0) {
    report += "- ✅ No recommendations — platform is healthy\n";
  } else {
    report += "| Priority | Recommendation |\n";
    report += "|---|---|\n";
    for (const rec of recommendations) {
      report += `| ${rec.priority} | ${rec.action} |\n`;
    }
  }

  report += `
---

## 6. Metrics History

### Tracking

This report is generated from \`docs/health-metrics.json\`.

To track changes over time:
1. Run \`npm run health:metrics\` to collect current metrics
2. Compare against previous values in \`docs/health-metrics.json\`
3. Review trends in the KPI dashboard

---

*Report generated by Sprint 07 Platform Health Framework*
`;

  return report;
}

// Main function
function main() {
  console.log("📊 Generating Platform Health Report\n");

  const metrics = loadMetrics();
  if (!metrics) {
    console.error("❌ No metrics found. Run 'npm run health:metrics' first.");
    process.exit(1);
  }

  const report = generateReport(metrics);

  try {
    fs.writeFileSync(REPORT_FILE, report);
    console.log(`✅ Report generated: ${path.relative(process.cwd(), REPORT_FILE)}\n`);
    
    // Print summary
    console.log("📋 Summary:");
    console.log(`   Health Score: ${metrics.healthScore}/100 (${metrics.healthRating})`);
    console.log(`   Behavior API Usages: ${metrics.adoption.behaviorApiUsages}`);
    console.log(`   Direct .animate() Calls: ${metrics.adoption.directAnimate}`);
    console.log(`   Documentation Rate: ${metrics.documentation.documentationRate}%`);
    console.log("");
  } catch (err) {
    console.error("Error generating report:", err.message);
    process.exit(1);
  }
}

main();
