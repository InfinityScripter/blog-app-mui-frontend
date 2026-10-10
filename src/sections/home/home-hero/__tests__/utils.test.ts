import { it, expect, describe } from "vitest";

import { HERO_TAP_REACTIONS } from "../const";
import { heroReaction, heroMotionTargets } from "../utils";

// ----------------------------------------------------------------------

describe("heroReaction", () => {
  it("waves and invites a tap before anything happens", () => {
    expect(heroReaction(undefined, 0)).toEqual({
      pose: "wave",
      bubble: "hint",
    });
  });

  it("reacts to the hovered social link", () => {
    expect(heroReaction("youtube", 0)).toEqual({
      pose: "point-left",
      bubble: "hover.youtube",
    });
    expect(heroReaction("telegram", 0).pose).toBe("thumbs-up");
  });

  it("a hovered link wins over the last tap", () => {
    expect(heroReaction("instagram", 3).bubble).toBe("hover.instagram");
  });

  it("cycles through tap reactions and wraps around", () => {
    const [first, second] = HERO_TAP_REACTIONS;

    expect(heroReaction(undefined, 1)).toEqual({
      pose: first.pose,
      bubble: `tap.${first.key}`,
    });
    expect(heroReaction(undefined, 2).pose).toBe(second.pose);
    expect(heroReaction(undefined, HERO_TAP_REACTIONS.length + 1)).toEqual(
      heroReaction(undefined, 1),
    );
  });
});

describe("heroMotionTargets", () => {
  it("keeps the stage still with reduced motion", () => {
    const still = heroMotionTargets("still");
    expect(still.hostScale).toBe(1);
    expect(still.wordShift).toBe(0);
    expect(still.night).toBe(0);
    expect(still.fade).toBe(1);
  });

  it("gives phones a light zoom without night or fading buttons", () => {
    const phone = heroMotionTargets("phone");
    expect(phone.hostScale).toBeGreaterThan(1);
    expect(phone.hostScale).toBeLessThan(
      heroMotionTargets("desktop").hostScale,
    );
    expect(phone.night).toBe(0);
    expect(phone.fade).toBe(1);
  });

  it("runs the full pinned scene on desktop", () => {
    const desktop = heroMotionTargets("desktop");
    expect(desktop.night).toBeGreaterThan(0);
    expect(desktop.fade).toBe(0);
  });
});
