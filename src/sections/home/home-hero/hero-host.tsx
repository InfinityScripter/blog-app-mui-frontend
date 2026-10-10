import type { PointerEvent } from "react";
import type { MotionValue } from "framer-motion";

import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import ButtonBase from "@mui/material/ButtonBase";
import {
  m,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

import { MInview } from "./m-inview";
import { HERO_POSES } from "./const";
import { HostPose } from "../components/host-pose";

import type { HeroReaction } from "./types";

// ----------------------------------------------------------------------

const TILT_SPRING = { stiffness: 160, damping: 18 };

interface HeroHostProps extends HeroReaction {
  bubbleOpacity: MotionValue<number>;
  onTap: () => void;
}

export function HeroHost({
  pose,
  bubble,
  bubbleOpacity,
  onTap,
}: HeroHostProps) {
  const t = useTranslations("home");
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), TILT_SPRING);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), TILT_SPRING);

  const handleMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MInview>
      <Box
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        sx={{ position: "relative" }}
      >
        <Box
          component={m.div}
          role="status"
          aria-live="polite"
          style={{ opacity: bubbleOpacity }}
          sx={{
            position: "absolute",
            zIndex: 1,
            top: { xs: -8, md: "10%" },
            right: { xs: -4, md: "auto" },
            left: { md: "-42%" },
            maxWidth: { xs: 190, md: 230 },
            typography: "body2",
          }}
        >
          <div
            key={bubble}
            className="ls-bubble"
            aria-hidden={!bubble.startsWith("tap.")}
          >
            {t(`hero.${bubble}`)}
          </div>
        </Box>

        <ButtonBase
          onClick={onTap}
          aria-label={t("hero.tapLabel")}
          className="ls-float"
          sx={{
            display: "block",
            width: 1,
            borderRadius: "50%",
            "&.Mui-focusVisible": {
              outline: (theme) =>
                `3px solid ${theme.vars.palette.primary.main}`,
              outlineOffset: 4,
            },
          }}
        >
          <m.div style={{ rotateX, rotateY, transformPerspective: 900 }}>
            <HostPose
              poses={HERO_POSES}
              active={pose}
              alt={t("hero.imageAlt")}
              priority
            />
          </m.div>
        </ButtonBase>
      </Box>
    </MInview>
  );
}
