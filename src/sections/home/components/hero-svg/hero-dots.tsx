import { Dot } from "./hero-dot";

// ----------------------------------------------------------------------

export function Dots() {
  return (
    <>
      <Dot
        color="error"
        animate={{ transform: "translateX(24px)" }}
        sx={{
          width: 14,
          height: 14,
          transform: "translate(calc(50% - 457px), calc(50% - 259px))",
        }}
      />

      <Dot
        color="warning"
        animate={{ transform: "translateY(24px)" }}
        sx={{ transform: "translate(calc(50% - 356px), calc(50% + 37px))" }}
      />

      <Dot
        color="info"
        animate={{ transform: "translateX(24px)" }}
        sx={{ transform: "translate(calc(50% + 332px), calc(50% + 135px))" }}
      />

      <Dot
        color="secondary"
        animate={{ transform: "translateX(24px)" }}
        sx={{ transform: "translate(calc(50% + 430px), calc(50% - 160px))" }}
      />

      <Dot
        color="success"
        animate={{ transform: "translateY(24px)" }}
        sx={{ transform: "translate(calc(50% + 136px), calc(50% + 332px))" }}
      />
    </>
  );
}
