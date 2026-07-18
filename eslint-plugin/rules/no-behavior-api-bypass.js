/**
 * Sprint 06: no-behavior-api-bypass
 * 
 * Detects Behavior API bypasses such as:
 * - Using Web Animations API directly outside of hooks
 * - Manipulating animation properties directly
 * - Bypassing the hook system
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Behavior API bypasses",
      category: "Behavior API Enforcement",
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    
    // Allow in hook files
    const isHookFile = /hooks\/use[A-Z]\w+\.tsx?$/.test(filename);
    if (isHookFile) {
      return {};
    }

    return {
      // Detect new Animation() constructor calls
      NewExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "Animation"
        ) {
          context.report({
            node,
            message:
              "Direct Animation constructor is prohibited. Use Behavior API hooks instead.",
          });
        }
      },

      // Detect getAnimations() calls
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "getAnimations"
        ) {
          context.report({
            node,
            message:
              "Direct getAnimations() calls are prohibited. Use Behavior API hooks instead.",
          });
        }
      },
    };
  },
};
