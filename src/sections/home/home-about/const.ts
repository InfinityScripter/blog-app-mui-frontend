import type { AboutHighlight } from "./types";

export const ABOUT_PROFILE = {
  name: "Михаил Талалаев",
  role: "Frontend Engineer",
  email: "talalaev.misha@gmail.com",
  imageSrc: "/assets/images/about/developer.webp",
  imageAlt: "Михаил Талалаев",
};

export const ABOUT_TITLE = "Обо мне";

/** Один сжатый абзац вместо трёх — лаконично и по делу. */
export const ABOUT_LEAD =
  "Frontend-инженер с 13+ годами в IT. Проектирую и развиваю продуктовые веб-интерфейсы на React, TypeScript и Next.js — с фокусом на производительность, чистую архитектуру и понятный DX.";

/** Сканируемые «факты» — заменяют длинные абзацы. */
export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    icon: "solar:clock-circle-bold-duotone",
    label: "Опыт",
    value: "13+ лет в IT",
  },
  {
    icon: "solar:cpu-bolt-bold-duotone",
    label: "Стек",
    value: "React · TypeScript · Next.js",
  },
  {
    icon: "solar:buildings-3-bold-duotone",
    label: "Компании",
    value: "Яндекс · СТОМПЛАН · ShurikMarket",
  },
];

/** Технологии-чипы под лидом — короткий и честный список основного стека. */
export const ABOUT_STACK = [
  "React",
  "TypeScript",
  "Next.js",
  "Angular",
  "Node.js",
  "Material UI",
  "Redux",
];
