/**
 * Sprint 06: no-direct-animate
 * 
 * Detects direct .animate() calls that bypass the Behavior API.
 * 
 * This rule flags any usage of element.animate() unless it's
 * within a Behavior API hook file.
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct .animate() calls outside Behavior API hooks",
      category: "Behavior API Enforcement",
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    
    // Allow .animate() in Behavior API hook files
    const isHookFile = /hooks\/use[A-Z]\w+\.tsx?$/.test(filename);
    if (isHookFile) {
      return {};
    }

    return {
      CallExpression(node) {
        const { callee } = node;
        
        // Check for element.animate() pattern
        if (
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          callee.property.name === "animate"
        ) {
          context.report({
            node,
            message:
              "Direct .animate() calls are prohibited. Use the Behavior API (useReveal, useAmbient, useFocus, useTransition, useInteraction, useStagger) instead.",
          });
        }
      },
    };
  },
};
