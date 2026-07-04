import { setFont, pxToRem, responsiveFontSizes } from "../styles/utils";

// ----------------------------------------------------------------------

export const defaultFont = "Manrope";

const primaryFont = setFont(defaultFont);

// Display face for the two top heading levels only (Unbounded — Cyrillic-first,
// OFL). h3–h6 stay on the workhorse grotesque so long RU strings keep fitting.
const secondaryFont = setFont("Unbounded");

// Mono for metadata: dates, reading time, counters, model versions, code.
export const monoFont = `var(--font-jetbrains-mono),"SFMono-Regular",Menlo,Consolas,monospace`;

// ----------------------------------------------------------------------

export const typography = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightLight: "300",
  fontWeightRegular: "400",
  fontWeightMedium: "500",
  fontWeightSemiBold: "600",
  fontWeightBold: "700",
  h1: {
    fontWeight: 600,
    lineHeight: 1.08,
    letterSpacing: "-0.02em",
    fontSize: pxToRem(38),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 46, md: 54, lg: 60 }),
  },
  h2: {
    fontWeight: 600,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    fontSize: pxToRem(28),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 32, md: 36, lg: 40 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: "-0.01em",
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 26, md: 28, lg: 30 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 22, lg: 24 }),
  },
  h5: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.6,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: "unset",
  },
};
