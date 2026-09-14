/**
 * Design-token ratchet for MUI `sx` / layout.
 *
 * Hex, quoted `px`, and raw `fontSize` belong in `src/theme/**` (or an
 * explicit allowlist in eslint.config.mjs). The allowlist *is* the backlog —
 * shrink it, don't grow it.
 */

const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const RAW_PX = /^-?\d+(?:\.\d+)?px$/;
const HAIRLINE_PX = /^-?(?:0(?:\.0+)?|1)px$/;
const OK_FONT_SIZE = /^(inherit|smaller|larger|unset|initial|revert|0|0px)$/;
const MAGIC_FONT_SIZE = /(?:px|rem)$/;

function stringValue(node) {
  if (!node) return null;
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis[0].value.cooked;
  }
  return null;
}

function numberValue(node) {
  if (node && node.type === "Literal" && typeof node.value === "number") {
    return node.value;
  }
  return null;
}

function unwrapJsx(node) {
  if (node && node.type === "JSXExpressionContainer") {
    return node.expression;
  }
  return node;
}

function propKey(node) {
  if (node.type === "Property") {
    if (node.key.type === "Identifier") return node.key.name;
    if (node.key.type === "Literal") return String(node.key.value);
  }
  if (
    node.type === "JSXAttribute" &&
    node.name &&
    node.name.type === "JSXIdentifier"
  ) {
    return node.name.name;
  }
  return null;
}

function visitStringLike(node, onString) {
  if (node.type === "Literal" && typeof node.value === "string") {
    onString(node, node.value);
    return;
  }
  if (node.type === "TemplateLiteral") {
    node.quasis.forEach((quasi) => {
      const cooked = quasi.value.cooked;
      if (typeof cooked === "string") onString(quasi, cooked);
    });
  }
}

const plugin = {
  meta: { name: "eslint-plugin-design-tokens" },
  rules: {
    "no-hex-color": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow hardcoded hex colors outside the theme token source.",
        },
        messages: {
          hex: "Hardcoded hex. Use theme.vars.palette / varAlpha(channel, opacity). Hex belongs in src/theme only.",
        },
        schema: [],
      },
      create(context) {
        return {
          Literal(node) {
            visitStringLike(node, (target, value) => {
              if (HEX.test(value)) {
                context.report({ node: target, messageId: "hex" });
              }
            });
          },
          TemplateLiteral(node) {
            visitStringLike(node, (target, value) => {
              if (HEX.test(value)) {
                context.report({ node: target, messageId: "hex" });
              }
            });
          },
        };
      },
    },

    "no-raw-px": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow quoted px lengths. Use sx spacing units or theme.shape.",
        },
        messages: {
          px: "Magic px string. Use sx spacing (`p: 2` → theme.spacing) or a named layout token. Hairline `1px`/`-1px` is allowed.",
        },
        schema: [],
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value !== "string") return;
            if (!RAW_PX.test(node.value)) return;
            if (HAIRLINE_PX.test(node.value)) return;
            context.report({ node, messageId: "px" });
          },
        };
      },
    },

    "no-raw-font-size": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow raw fontSize numbers/px/rem. Use Typography variants.",
        },
        messages: {
          fontSize:
            "Magic fontSize. Use a Typography `variant`, monoLabelSx/monoValueSx, or theme.typography.*.fontSize.",
        },
        schema: [],
      },
      create(context) {
        function check(_node, valueNode) {
          const raw = unwrapJsx(valueNode);
          const num = numberValue(raw);
          if (num !== null && num !== 0) {
            context.report({ node: raw, messageId: "fontSize" });
            return;
          }
          const str = stringValue(raw);
          if (str === null) return;
          if (OK_FONT_SIZE.test(str)) return;
          if (MAGIC_FONT_SIZE.test(str)) {
            context.report({ node: raw, messageId: "fontSize" });
          }
        }

        return {
          Property(node) {
            if (propKey(node) !== "fontSize") return;
            check(node, node.value);
          },
          JSXAttribute(node) {
            if (propKey(node) !== "fontSize") return;
            check(node, node.value);
          },
        };
      },
    },
  },
};

export default plugin;
