#!/usr/bin/env node

/**
 * Sprint 07: Platform Health Metrics Collector
 * 
 * Collects and reports on the health of the Behavior API platform.
 * 
 * Usage:
 *   node scripts/health-metrics.js
 *   npm run health:metrics
 * 
 * Output:
 *   - Console report
 *   - JSON file (docs/health-metrics.json)
 */

const fs = require("fs");
const path = require("path");

// Configuration
const SRC_DIR = path.resolve(__dirname, "../src");
const HOOKS_DIR = path.resolve(__dirname, "../src/hooks");
const EXCEPTIONS_FILE = path.resolve(__dirname, "../docs/behavior-exceptions.json");
const OUTPUT_FILE = path.resolve(__dirname, "../docs/health-metrics.json");

// Authorized Behavior API hooks
const BEHAVIOR_API_HOOKS = [
  "useAmbient",
  "useReveal",
  "useFocus",
  "useTransition",
  "useInteraction",
  "useStagger",
];

// Unauthorized animation libraries
const UNAUTHORIZED_LIBS = [
  "framer-motion",
  "motion",
  "react-spring",
  "react-transition-group",
  "animejs",
  "gsap",
];

// Load exceptions
function loadExceptions() {
  try {
    if (fs.existsSync(EXCEPTIONS_FILE)) {
      return JSON.parse(fs.readFileSync(EXCEPTIONS_FILE, "utf-8")).exceptions;
    }
  } catch {}
  return [];
}

// Recursively find all TSX/TS files
function findFiles(dir, extensions = [".tsx", ".ts"]) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !["node_modules", ".next", "dist", "build"].includes(entry.name)) {
        files.push(...findFiles(fullPath, extensions));
      } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch {}
  return files;
}

// Count occurrences of a pattern in files
function countPattern(files, pattern, excludePatterns = []) {
  let count = 0;
  const matches = [];

  for (const file of files) {
    // Skip excluded files
    if (excludePatterns.some((p) => {
      if (p instanceof RegExp) return p.test(file);
      return file.includes(p);
    })) continue;

    try {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        if (pattern.test(line)) {
          count++;
          matches.push({ file: path.relative(SRC_DIR, file), line: line.trim() });
        }
        pattern.lastIndex = 0;
      }
    } catch {}
  }

  return { count, matches };
}

// Collect Behavior API adoption metrics
function collectAdoptionMetrics(files, exceptions) {
  const hookFiles = files.filter((f) => /hooks[/\\]use[A-Z]\w+\.tsx?$/.test(f));
  const componentFiles = files.filter((f) => !f.includes("hooks") && (f.endsWith(".tsx") || f.endsWith(".ts")));

  // Count Behavior API hook imports
  let behaviorApiImports = 0;
  let behaviorApiUsages = 0;
  const hookUsageCount = {};

  for (const file of componentFiles) {
    try {
      const content = fs.readFileSync(file, "utf-8");

      // Check for Behavior API imports
      for (const hook of BEHAVIOR_API_HOOKS) {
        if (content.includes(`import { ${hook} }`) || content.includes(`from "@/hooks/behavior"`)) {
          behaviorApiImports++;
        }

        // Count usages
        const usageRegex = new RegExp(`\\b${hook}\\s*\\(`, "g");
        const usageMatches = content.match(usageRegex);
        if (usageMatches) {
          behaviorApiUsages += usageMatches.length;
          hookUsageCount[hook] = (hookUsageCount[hook] || 0) + usageMatches.length;
        }
      }
    } catch {}
  }

  // Count direct .animate() calls (outside hooks)
  const directAnimate = countPattern(
    files,
    /\.animate\s*\(/,
    [/hooks[/\\]use[A-Z]/]
  );

  // Count inline animation styles
  const inlineAnimations = countPattern(
    files,
    /animation\s*:/,
    [/loading\.tsx$/]
  );

  // Count unauthorized library imports (excluding approved exceptions)
  let unauthorizedLibImports = 0;
  const approvedLibs = exceptions
    .filter((e) => e.file.startsWith("legacy:"))
    .map((e) => e.file.replace("legacy:", ""));

  for (const file of componentFiles) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      for (const lib of UNAUTHORIZED_LIBS) {
        // Skip approved libraries
        if (approvedLibs.includes(lib)) continue;
        
        const importRegex = new RegExp(`from\\s+["']${lib}["']`, "g");
        if (importRegex.test(content)) {
          unauthorizedLibImports++;
        }
      }
    } catch {}
  }

  return {
    hookFiles: hookFiles.length,
    componentFiles: componentFiles.length,
    behaviorApiImports,
    behaviorApiUsages,
    hookUsageCount,
    directAnimate: directAnimate.count,
    inlineAnimations: inlineAnimations.count,
    unauthorizedLibImports,
  };
}

// Collect exception metrics
function collectExceptionMetrics(exceptions) {
  const approved = exceptions.filter((e) => e.reviewStatus === "approved").length;
  const pending = exceptions.filter((e) => e.reviewStatus === "pending").length;
  const expired = exceptions.filter((e) => {
    if (e.expirationDate) {
      return new Date(e.expirationDate) < new Date();
    }
    return false;
  }).length;

  const expiringSoon = exceptions.filter((e) => {
    if (e.expirationDate) {
      const expiry = new Date(e.expirationDate);
      const now = new Date();
      const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }
    return false;
  }).length;

  return {
    total: exceptions.length,
    approved,
    pending,
    expired,
    expiringSoon,
  };
}

// Collect code quality metrics
function collectCodeQualityMetrics(files) {
  // Count components with "use client"
  let clientComponents = 0;
  let serverComponents = 0;

  for (const file of files.filter((f) => f.endsWith(".tsx"))) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      if (content.includes('"use client"') || content.includes("'use client'")) {
        clientComponents++;
      } else {
        serverComponents++;
      }
    } catch {}
  }

  // Count accessibility attributes
  const ariaAttributes = countPattern(files, /aria-[a-z]+=/);
  const roleAttributes = countPattern(files, /role="/);

  return {
    clientComponents,
    serverComponents,
    ariaAttributes: ariaAttributes.count,
    roleAttributes: roleAttributes.count,
  };
}

// Collect documentation metrics
function collectDocumentationMetrics(exceptions) {
  const documented = exceptions.filter((e) => e.reason && e.evidence && e.scope).length;
  const withExpiration = exceptions.filter((e) => e.expirationDate !== null).length;
  const withOwner = exceptions.filter((e) => e.owner).length;

  return {
    totalExceptions: exceptions.length,
    documented,
    withExpiration,
    withOwner,
    documentationRate: exceptions.length > 0
      ? Math.round((documented / exceptions.length) * 100)
      : 100,
  };
}

// Generate health score
function generateHealthScore(metrics) {
  let score = 100;

  // Deduct for direct .animate() calls
  score -= metrics.adoption.directAnimate * 5;

  // Deduct for unauthorized library usage
  score -= metrics.adoption.unauthorizedLibImports * 2;

  // Deduct for expired exceptions
  score -= metrics.exceptions.expired * 10;

  // Deduct for expiring soon exceptions
  score -= metrics.exceptions.expiringSoon * 2;

  // Bonus for high Behavior API usage
  if (metrics.adoption.behaviorApiUsages > 10) {
    score += 5;
  }

  // Clamp score
  return Math.max(0, Math.min(100, score));
}

// Generate health rating
function getHealthRating(score) {
  if (score >= 90) return "EXCELLENT";
  if (score >= 80) return "GOOD";
  if (score >= 70) return "FAIR";
  if (score >= 60) return "NEEDS IMPROVEMENT";
  return "CRITICAL";
}

// Main function
function main() {
  console.log("📊 Platform Health Metrics\n");
  console.log("=".repeat(50) + "\n");

  const exceptions = loadExceptions();
  const files = findFiles(SRC_DIR);

  // Collect metrics
  const adoption = collectAdoptionMetrics(files, exceptions);
  const exceptionMetrics = collectExceptionMetrics(exceptions);
  const codeQuality = collectCodeQualityMetrics(files);
  const documentation = collectDocumentationMetrics(exceptions);

  const metrics = {
    timestamp: new Date().toISOString(),
    adoption,
    exceptions: exceptionMetrics,
    codeQuality,
    documentation,
  };

  // Generate health score
  const healthScore = generateHealthScore(metrics);
  const healthRating = getHealthRating(healthScore);
  metrics.healthScore = healthScore;
  metrics.healthRating = healthRating;

  // Print report
  console.log("🎯 BEHAVIOR API ADOPTION");
  console.log("-".repeat(40));
  console.log(`  Hook files:              ${adoption.hookFiles}`);
  console.log(`  Component files:         ${adoption.componentFiles}`);
  console.log(`  Behavior API imports:    ${adoption.behaviorApiImports}`);
  console.log(`  Behavior API usages:     ${adoption.behaviorApiUsages}`);
  console.log(`  Direct .animate() calls: ${adoption.directAnimate}`);
  console.log(`  Inline animations:       ${adoption.inlineAnimations}`);
  console.log(`  Unauthorized lib usage:  ${adoption.unauthorizedLibImports}`);
  console.log("");

  console.log("  Hook Usage Breakdown:");
  for (const [hook, count] of Object.entries(adoption.hookUsageCount)) {
    console.log(`    ${hook}: ${count}`);
  }
  console.log("");

  console.log("📋 EXCEPTION MANAGEMENT");
  console.log("-".repeat(40));
  console.log(`  Total exceptions:    ${exceptionMetrics.total}`);
  console.log(`  Approved:            ${exceptionMetrics.approved}`);
  console.log(`  Pending:             ${exceptionMetrics.pending}`);
  console.log(`  Expired:             ${exceptionMetrics.expired}`);
  console.log(`  Expiring soon:       ${exceptionMetrics.expiringSoon}`);
  console.log("");

  console.log("🔍 CODE QUALITY");
  console.log("-".repeat(40));
  console.log(`  Client components:   ${codeQuality.clientComponents}`);
  console.log(`  Server components:   ${codeQuality.serverComponents}`);
  console.log(`  ARIA attributes:     ${codeQuality.ariaAttributes}`);
  console.log(`  Role attributes:     ${codeQuality.roleAttributes}`);
  console.log("");

  console.log("📝 DOCUMENTATION");
  console.log("-".repeat(40));
  console.log(`  Total exceptions:    ${documentation.totalExceptions}`);
  console.log(`  Documented:          ${documentation.documented}`);
  console.log(`  With expiration:     ${documentation.withExpiration}`);
  console.log(`  With owner:          ${documentation.withOwner}`);
  console.log(`  Documentation rate:  ${documentation.documentationRate}%`);
  console.log("");

  console.log("🏥 HEALTH SCORE");
  console.log("=".repeat(40));
  console.log(`  Score: ${healthScore}/100`);
  console.log(`  Rating: ${healthRating}`);
  console.log("");

  // Save metrics to file
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metrics, null, 2));
    console.log(`📄 Metrics saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);
  } catch (err) {
    console.error("Error saving metrics:", err.message);
  }
}

main();
