import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";

import type { HostPoseName } from "./types";

// ----------------------------------------------------------------------

interface HostPoseProps {
  poses: readonly HostPoseName[];
  active: HostPoseName;
  alt: string;
  priority?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Every pose is mounted up front and only the active one is visible, so a
 * pose switch is an instant crossfade instead of a blank frame while the next
 * image downloads.
 */
export function HostPose({ poses, active, alt, priority, sx }: HostPoseProps) {
  return (
    <Box
      className="ls-host"
      sx={{ position: "relative", aspectRatio: "1", width: 1, ...sx }}
    >
      {poses.map((pose, index) => {
        const isActive = pose === active;
        const eager = priority && index === 0;
        return (
          <Box
            key={pose}
            component="img"
            className="ls-host__pose"
            data-active={isActive}
            src={`/assets/life-style/host/${pose}.webp`}
            alt={isActive ? alt : ""}
            aria-hidden={!isActive}
            width={560}
            height={560}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            draggable={false}
          />
        );
      })}
    </Box>
  );
}
