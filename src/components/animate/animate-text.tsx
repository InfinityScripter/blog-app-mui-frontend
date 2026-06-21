import type { Variants } from "framer-motion";

import Box from "@mui/material/Box";
import { useRef, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { m, useInView, useAnimation } from "framer-motion";

import { animateTextClasses } from "./const";
import { varFade, varContainer } from "./variants";

import type { AnimateTextProps } from "./types";

// ----------------------------------------------------------------------

export { animateTextClasses } from "./const";

export function AnimateText({
  sx,
  text,
  variants,
  once = true,
  amount = 1 / 3,
  component = "p",
  repeatDelay = 500, // 1000 = 1s
  ...other
}: AnimateTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const controls = useAnimation();

  const textArray = Array.isArray(text) ? text : [text];

  const isInView = useInView(ref, { once, amount });

  const charVariants: Variants = variants ?? varFade({}).in;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const show = () => {
      if (repeatDelay) {
        timeout = setTimeout(async () => {
          await controls.start("initial");
          controls.start("animate");
        }, repeatDelay);
      } else {
        controls.start("animate");
      }
    };

    if (isInView) {
      show();
    } else {
      controls.start("initial");
    }

    return () => clearTimeout(timeout);
  }, [controls, isInView, repeatDelay]);

  return (
    <Typography
      component={component}
      className={animateTextClasses.root}
      sx={{
        p: 0,
        m: 0,
        /**
         * Utilities for improving accessibility with screen readers.
         * https://v1.tailwindcss.com/docs/screen-readers
         */
        [`& .${animateTextClasses.srOnly}`]: {
          p: 0,
          width: "1px",
          height: "1px",
          margin: "-1px",
          borderWidth: 0,
          overflow: "hidden",
          position: "absolute",
          whiteSpace: "nowrap",
          clip: "rect(0, 0, 0, 0)",
        },
        ...sx,
      }}
      {...other}
    >
      <span className={animateTextClasses.srOnly}>{textArray.join(" ")}</span>

      <Box
        component={m.span}
        ref={ref}
        initial="initial"
        animate={controls}
        exit="exit"
        variants={varContainer({})}
        aria-hidden
        className={animateTextClasses.lines}
      >
        {textArray.map((line, lineIndex) => (
          <Box
            component="span"
            key={`${line}-${lineIndex}`}
            data-index={lineIndex}
            className={animateTextClasses.line}
            sx={{ display: "block" }}
          >
            {line.split(" ").map((word, wordIndex) => {
              const lastWordInline =
                line.split(" ")[line.split(" ").length - 1];

              return (
                <Box
                  component="span"
                  key={`${word}-${wordIndex}`}
                  data-index={wordIndex}
                  className={animateTextClasses.word}
                  sx={{ display: "inline-block" }}
                >
                  {word.split("").map((char, charIndex) => (
                    <m.span
                      key={`${char}-${charIndex}`}
                      variants={charVariants}
                      data-index={charIndex}
                      className={animateTextClasses.char}
                      style={{ display: "inline-block" }}
                    >
                      {char}
                    </m.span>
                  ))}

                  {lastWordInline !== word && (
                    <Box
                      component="span"
                      className={animateTextClasses.space}
                      sx={{ display: "inline-block" }}
                    >
                      &nbsp;
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Typography>
  );
}
