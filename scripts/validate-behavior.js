#!/usr/bin/env node

/**
 * Sprint 06: Behavior API Validation Script
 * 
 * This script validates that all components comply with the Behavior API.
 * It can be run during CI/CD to enforce platform standards.
 * 
 * Usage:
 *   node scripts/validate-behavior.js
 *   npm run validate:behavior
 * 
 * Exit codes:
 *   0 - All checks passed
 *   1 - Violations found
 */

const fs = require("fs");
const path = require("path");

// Configuration
const SRC_DIR = path.resolve(__dirname, "../src");
const EXCEPTIONS_FILE = path.resolve(__dirname, "../docs/behavior-exceptions.json");

// Patterns to detect
const PATTERNS = {
  // Direct .animate() calls
  directAnimate: /\.animate\s*\(/g,
  
  // CSS animation inline styles
  inlineAnimation: /animation\s*:\s*["']([^"']+)["']/g,
  
  // @keyframes definitions (outside of approved files)
  keyframes: /@keyframes\s+[\w-]+/g,
  
  // Unauthorized animation libraries
  unauthorizedLibs: [
    /from\s+["']framer-motion["']/g,
    /from\s+["']motion["']/g,
    /from\s+["']react-spring["']/g,
    /from\s+["']react-transition-group["']/g,
    /from\s+["']animejs["']/g,
    /from\s+["']gsap["']/g,
  ],
};

// Files to exclude
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /dist/,
  /build/,
  /hooks[/\\]use[A-Z]\w+\.tsx?$/, // Allow in hook files
];

// Load approved exceptions
function loadExceptions() {
  try {
    if (fs.existsSync(EXCEPTIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(EXCEPTIONS_FILE, "utf-8"));
      return data.exceptions;
    }
  } catch (err) {
    console.error("Error loading exceptions:", err.message);
  }
  return [];
}

// Check if file is in approved exceptions
function isApprovedException(filePath, exceptions) {
  // Normalize path separators for cross-platform
  const normalizedPath = filePath.replace(/\\/g, "/");
  return exceptions.some((exception) => {
    // Handle library-level exceptions (e.g., "legacy:framer-motion")
    if (exception.file.startsWith("legacy:")) {
      return false; // These are handled separately in unauthorized libs check
    }
    const normalizedExceptionFile = exception.file.replace(/\\/g, "/");
    return normalizedPath.includes(normalizedExceptionFile);
  });
}

// Check if unauthorized library is approved
function isApprovedLibrary(libraryName, exceptions) {
  return exceptions.some((exception) => {
    if (exception.file.startsWith("legacy:")) {
      const libName = exception.file.replace("legacy:", "");
      return libName === libraryName;
    }
    return false;
  });
}

// Check if line is a comment (not actual code)
function isComment(line) {
  const trimmed = line.trim();
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("* ")
  );
}

// Check if file should be excluded
function shouldExclude(filePath, excludePatterns) {
  return excludePatterns.some((pattern) => pattern.test(filePath));
}

// Scan file for violations
function scanFile(filePath, exceptions) {
  const violations = [];
  
  if (isApprovedException(filePath, exceptions)) {
    return violations;
  }
  
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    
    // Check for direct .animate() calls
    lines.forEach((line, index) => {
      if (PATTERNS.directAnimate.test(line)) {
        violations.push({
          file: filePath,
          line: index + 1,
          rule: "no-direct-animate",
          message: "Direct .animate() call detected",
        });
      }
      PATTERNS.directAnimate.lastIndex = 0; // Reset regex
    });
    
    // Check for inline animation styles
    lines.forEach((line, index) => {
      if (PATTERNS.inlineAnimation.test(line)) {
        violations.push({
          file: filePath,
          line: index + 1,
          rule: "no-inline-animation",
          message: "Inline animation style detected",
        });
      }
      PATTERNS.inlineAnimation.lastIndex = 0;
    });
    
    // Check for @keyframes definitions (skip comments)
    lines.forEach((line, index) => {
      if (PATTERNS.keyframes.test(line) && !isComment(line)) {
        violations.push({
          file: filePath,
          line: index + 1,
          rule: "no-keyframes",
          message: "Direct @keyframes definition detected",
        });
      }
      PATTERNS.keyframes.lastIndex = 0;
    });
    
    // Check for unauthorized animation libraries
    const libNames = ["framer-motion", "motion", "react-spring", "react-transition-group", "animejs", "gsap"];
    PATTERNS.unauthorizedLibs.forEach((pattern, libIndex) => {
      const libName = libNames[libIndex];
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          if (!isApprovedLibrary(libName, exceptions)) {
            violations.push({
              file: filePath,
              line: index + 1,
              rule: "no-unauthorized-animation-lib",
              message: `Unauthorized animation library "${libName}" detected`,
            });
          }
        }
        pattern.lastIndex = 0;
      });
    });
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err.message);
  }
  
  return violations;
}

// Recursively scan directory
function scanDirectory(dirPath, exceptions) {
  const violations = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldExclude(fullPath, EXCLUDE_PATTERNS)) {
          violations.push(...scanDirectory(fullPath, exceptions));
        }
      } else if (entry.isFile()) {
        if (
          /\.(tsx?|jsx?)$/.test(entry.name) &&
          !shouldExclude(fullPath, EXCLUDE_PATTERNS)
        ) {
          violations.push(...scanFile(fullPath, exceptions));
        }
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dirPath}:`, err.message);
  }
  
  return violations;
}

// Main function
function main() {
  console.log("🔍 Behavior API Validation\n");
  
  const exceptions = loadExceptions();
  console.log(`📋 Loaded ${exceptions.length} approved exceptions\n`);
  
  console.log("📁 Scanning source files...");
  const violations = scanDirectory(SRC_DIR, exceptions);
  
  if (violations.length === 0) {
    console.log("\n✅ All checks passed! No violations found.\n");
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${violations.length} violation(s):\n`);
    
    // Group violations by file
    const byFile = {};
    violations.forEach((v) => {
      if (!byFile[v.file]) {
        byFile[v.file] = [];
      }
      byFile[v.file].push(v);
    });
    
    // Print violations
    Object.entries(byFile).forEach(([file, fileViolations]) => {
      const relativePath = path.relative(path.resolve(__dirname, ".."), file);
      console.log(`📄 ${relativePath}`);
      fileViolations.forEach((v) => {
        console.log(`   Line ${v.line}: [${v.rule}] ${v.message}`);
      });
      console.log("");
    });
    
    console.log("To add an approved exception, update docs/behavior-exceptions.json\n");
    process.exit(1);
  }
}

main();
