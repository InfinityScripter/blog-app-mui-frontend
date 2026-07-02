import { styled } from "@mui/material/styles";
import { varAlpha, stylesMode } from "src/theme/styles";

import { markdownClasses } from "./classes";

// ----------------------------------------------------------------------

const MARGIN = "0.75em";

export const StyledRoot = styled("div")(({ theme }) => ({
  "> * + *": {
    marginTop: 0,
    marginBottom: MARGIN,
  },
  /**
   * Heading & Paragraph
   */
  h1: { ...theme.typography.h1, marginTop: 40, marginBottom: 8 },
  h2: { ...theme.typography.h2, marginTop: 40, marginBottom: 8 },
  h3: { ...theme.typography.h3, marginTop: 24, marginBottom: 8 },
  h4: { ...theme.typography.h4, marginTop: 24, marginBottom: 8 },
  h5: { ...theme.typography.h5, marginTop: 24, marginBottom: 8 },
  h6: { ...theme.typography.h6, marginTop: 24, marginBottom: 8 },
  // Reading measure: чуть крупнее и воздушнее базового body1 (Editorial Ink).
  p: {
    ...theme.typography.body1,
    fontSize: 18,
    lineHeight: 1.7,
    marginBottom: "1.25rem",
  },
  /**
   * Hr Divider
   */
  hr: {
    flexShrink: 0,
    borderWidth: 0,
    margin: "2em 0",
    msFlexNegative: 0,
    WebkitFlexShrink: 0,
    borderStyle: "solid",
    borderBottomWidth: "thin",
    borderColor: theme.vars.palette.divider,
  },
  /**
   * Image
   */
  [`& .${markdownClasses.content.image}`]: {
    width: "100%",
    height: "auto",
    maxWidth: "100%",
    margin: "auto auto 1.25em",
  },
  /**
   * List
   */
  "& ul": {
    listStyleType: "disc",
  },
  "& ul, & ol": {
    paddingLeft: 16,
    "& > li": {
      lineHeight: 2,
      "& > p": { margin: 0, display: "inline-block" },
    },
  },
  /**
   * Blockquote
   */
  "& blockquote": {
    lineHeight: 1.55,
    fontSize: "1.25em",
    fontStyle: "italic",
    margin: "24px auto",
    position: "relative",
    padding: theme.spacing(2, 3, 2, 5),
    color: theme.vars.palette.text.secondary,
    borderLeft: `solid 3px ${theme.vars.palette.primary.main}`,
    [theme.breakpoints.up("md")]: {
      width: "100%",
      maxWidth: 640,
    },
    "& p": {
      margin: 0,
      fontSize: "inherit",
      fontFamily: "inherit",
    },
  },
  /**
   * Code inline
   */
  [`& .${markdownClasses.content.codeInline}`]: {
    padding: theme.spacing(0.25, 0.5),
    color: theme.vars.palette.text.secondary,
    fontSize: theme.typography.body2.fontSize,
    borderRadius: Number(theme.shape.borderRadius) / 2,
    backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.2),
  },
  /**
   * Code Block
   */
  [`& .${markdownClasses.content.codeBlock}`]: {
    position: "relative",
    "& pre": {
      overflowX: "auto",
      padding: theme.spacing(3),
      color: theme.vars.palette.common.white,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.vars.palette.grey[900],
      fontFamily: "'JetBrainsMono', monospace",
      "& code": { fontSize: theme.typography.body2.fontSize },
    },
  },
  /**
   * Table
   */
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: `1px solid ${theme.vars.palette.divider}`,
    "th, td": {
      padding: theme.spacing(1),
      border: `1px solid ${theme.vars.palette.divider}`,
    },
    "tbody tr:nth-of-type(odd)": {
      backgroundColor: theme.vars.palette.background.neutral,
    },
  },
  /**
   * Checkbox
   */
  input: {
    "&[type=checkbox]": {
      position: "relative",
      cursor: "pointer",
      "&:before": {
        content: '""',
        top: -2,
        left: -2,
        width: 17,
        height: 17,
        borderRadius: 3,
        position: "absolute",
        backgroundColor: theme.vars.palette.grey[300],
        [stylesMode.dark]: { backgroundColor: theme.vars.palette.grey[700] },
      },
      "&:checked": {
        "&:before": { backgroundColor: theme.vars.palette.primary.main },
        "&:after": {
          content: '""',
          top: 1,
          left: 5,
          width: 4,
          height: 9,
          position: "absolute",
          transform: "rotate(45deg)",
          msTransform: "rotate(45deg)",
          WebkitTransform: "rotate(45deg)",
          border: `solid ${theme.vars.palette.common.white}`,
          borderWidth: "0 2px 2px 0",
        },
      },
    },
  },
}));
