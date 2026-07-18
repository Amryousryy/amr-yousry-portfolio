/**
 * Sprint 06: Behavior Enforcement ESLint Plugin
 * 
 * This plugin enforces the Behavior API as the single behavioral
 * interface across the platform. It detects:
 * 
 * - Direct .animate() calls outside Behavior API hooks
 * - CSS animation inline styles on elements
 * - Unauthorized animation library usage
 * - Behavior API bypasses
 * - Undocumented exceptions
 */

const noDirectAnimate = require("./rules/no-direct-animate");
const noInlineAnimation = require("./rules/no-inline-animation");
const noUnauthorizedAnimationLib = require("./rules/no-unauthorized-animation-lib");
const noBehaviorApiBypass = require("./rules/no-behavior-api-bypass");

module.exports = {
  rules: {
    "no-direct-animate": noDirectAnimate,
    "no-inline-animation": noInlineAnimation,
    "no-unauthorized-animation-lib": noUnauthorizedAnimationLib,
    "no-behavior-api-bypass": noBehaviorApiBypass,
  },
  configs: {
    recommended: {
      plugins: ["behavior"],
      rules: {
        "behavior/no-direct-animate": "warn",
        "behavior/no-inline-animation": "warn",
        "behavior/no-unauthorized-animation-lib": "error",
        "behavior/no-behavior-api-bypass": "error",
      },
    },
  },
};
