/**
 * Sprint 06: no-unauthorized-animation-lib
 * 
 * Detects unauthorized animation library usage.
 * 
 * Only the Behavior API hooks are authorized for animations.
 * Third-party animation libraries are prohibited.
 */

const UNAUTHORIZED_LIBRARIES = [
  "framer-motion",
  "motion",
  "react-spring",
  "react-transition-group",
  "animejs",
  "gsap",
  "velocity-react",
  "react-move",
  "popmotion",
  "react-flip-toolkit",
];

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow unauthorized animation library imports",
      category: "Behavior API Enforcement",
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        
        if (UNAUTHORIZED_LIBRARIES.includes(source)) {
          context.report({
            node,
            message: `Unauthorized animation library "${source}". Use the Behavior API hooks instead.`,
          });
        }
      },

      // Also check dynamic imports
      CallExpression(node) {
        if (
          node.callee.type === "Import" &&
          node.arguments.length > 0 &&
          node.arguments[0].type === "Literal"
        ) {
          const source = node.arguments[0].value;
          
          if (UNAUTHORIZED_LIBRARIES.includes(source)) {
            context.report({
              node,
              message: `Unauthorized animation library "${source}". Use the Behavior API hooks instead.`,
            });
          }
        }
      },
    };
  },
};
