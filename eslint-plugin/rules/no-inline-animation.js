/**
 * Sprint 06: no-inline-animation
 * 
 * Detects inline animation styles that bypass the Behavior API.
 * 
 * This rule flags style={{ animation: "..." }} patterns unless
 * the file is in the approved exceptions list.
 */

const fs = require("fs");
const path = require("path");

// Load approved exceptions
function getApprovedExceptions() {
  try {
    const exceptionsPath = path.resolve(
      __dirname,
      "../../docs/behavior-exceptions.json"
    );
    if (fs.existsSync(exceptionsPath)) {
      const data = JSON.parse(fs.readFileSync(exceptionsPath, "utf-8"));
      return data.exceptions.map((e) => e.file);
    }
  } catch {}
  return [];
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow inline animation styles outside Behavior API",
      category: "Behavior API Enforcement",
      recommended: true,
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    const approvedExceptions = getApprovedExceptions();

    // Check if file is in approved exceptions
    const isApproved = approvedExceptions.some((exception) =>
      filename.includes(exception)
    );
    if (isApproved) {
      return {};
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== "style") return;
        if (!node.value || node.value.type !== "JSXExpressionContainer") return;

        const { expression } = node.value;
        if (expression.type !== "ObjectExpression") return;

        for (const prop of expression.properties) {
          if (
            prop.type === "Property" &&
            prop.key.type === "Identifier" &&
            prop.key.name === "animation"
          ) {
            context.report({
              node,
              message:
                "Inline animation styles are prohibited. Use the Behavior API instead. If this is an approved exception, add it to docs/behavior-exceptions.json.",
            });
          }
        }
      },
    };
  },
};
