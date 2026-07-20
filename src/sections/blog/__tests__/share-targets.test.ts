import type { ShareTarget } from "src/sections/blog/const";

import { it, expect, describe } from "vitest";
import { SHARE_TARGETS } from "src/sections/blog/const";

const URL = "https://aifirst.us.com/post/abc123/";
const TITLE = "Заголовок & <тест>";

function targetByName(name: ShareTarget["name"]): ShareTarget {
  const found = SHARE_TARGETS.find((target) => target.name === name);
  if (!found) throw new Error(`missing share target: ${name}`);
  return found;
}

describe("SHARE_TARGETS", () => {
  it("builds the Telegram share intent with encoded url and text", () => {
    const href = targetByName("telegram").href(URL, TITLE);
    expect(href).toBe(
      `https://t.me/share/url?url=${encodeURIComponent(URL)}&text=${encodeURIComponent(TITLE)}`,
    );
  });

  it("builds the X (twitter) share intent with encoded url and text", () => {
    const href = targetByName("twitter").href(URL, TITLE);
    expect(href).toBe(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(URL)}&text=${encodeURIComponent(TITLE)}`,
    );
  });

  it("builds the VK share intent with encoded url", () => {
    const href = targetByName("vk").href(URL, TITLE);
    expect(href).toBe(
      `https://vk.com/share.php?url=${encodeURIComponent(URL)}`,
    );
  });

  it("encodes special characters rather than passing them raw", () => {
    const href = targetByName("telegram").href(URL, TITLE);
    expect(href).not.toContain(" <тест>");
    expect(href).toContain("%3C");
  });
});
