window.STATE =
{
  "version": 2,
  "slug": "site-improvements",
  "dir": "2026-10-14-site-improvements--wip",
  "title": "Улучшения сайта aifirst.us.com",
  "mode": "full",
  "depth": "normal",
  "tier": "T1",
  "briefFile": "2026-10-14-brief.md",
  "memoryFile": "CLAUDE.md",
  "memoryOwner": "user",
  "skillDir": "/Users/kot/.claude/skills/autopilot",
  "baseCommit": null,
  "startedAt": "2026-10-14T21:45:58+03:00",
  "updatedAt": "2026-10-14T21:52:16+03:00",
  "finishedAt": null,
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-10-14T21:45:58+03:00",
      "finishedAt": "2026-10-14T21:46:04+03:00"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-10-14T21:46:04+03:00",
      "finishedAt": "2026-10-14T21:51:51+03:00"
    },
    {
      "id": "briefing",
      "status": "skipped",
      "startedAt": "2026-10-14T21:51:51+03:00",
      "finishedAt": "2026-10-14T21:51:51+03:00",
      "note": "полный автомат — самобрифинг"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-10-14T21:51:51+03:00",
      "finishedAt": "2026-10-14T21:52:16+03:00"
    },
    {
      "id": "plan",
      "status": "active",
      "startedAt": "2026-10-14T21:52:16+03:00"
    },
    {
      "id": "build",
      "status": "pending"
    },
    {
      "id": "review",
      "status": "pending"
    },
    {
      "id": "final",
      "status": "pending"
    }
  ],
  "requirements": {
    "total": 5,
    "done": 0,
    "inTicket": 4,
    "inSpec": 0,
    "placeholder": 0,
    "deferred": 1,
    "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Чейнджлог в поиске и подписи у иконок",
      "requirements": [
        "R01",
        "R02",
        "R03i",
        "R04i"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "src/app/[locale]/changelog/",
        "src/app/[locale]/(index)/privacy-policy/",
        "src/app/[locale]/(index)/personal-data-consent/",
        "src/layouts/",
        "src/sections/llm-compare/",
        "messages/"
      ],
      "review": "нет",
      "model": "обычная",
      "status": "pending",
      "retries": 0,
      "repairs": 0
    },
    {
      "id": "02",
      "title": "Лента новостей: быстрая первая картинка и без пустых ссылок",
      "requirements": [
        "R03i",
        "R04i"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "src/sections/news/",
        "src/components/image/"
      ],
      "review": "нет",
      "model": "обычная",
      "status": "pending",
      "retries": 0,
      "repairs": 0
    }
  ],
  "tests": null,
  "debt": {
    "placeholders": [],
    "assumptions": [
      "В сборку взяты только подтверждённые находки 1–7 с ограниченной правкой; 8–11 — в отчёт"
    ],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": {
    "found": 1,
    "fixed": 1,
    "deferred": 0,
    "items": []
  },
  "concerns": [],
  "blind": null,
  "beats": [
    "2026-10-14T21:45:58+03:00",
    "2026-10-14T21:46:04+03:00",
    "2026-10-14T21:46:11+03:00",
    "2026-10-14T21:51:51+03:00",
    "2026-10-14T21:51:52+03:00",
    "2026-10-14T21:52:16+03:00"
  ],
  "rev": 12,
  "waiting": null,
  "waits": [],
  "log": [
    {
      "t": "2026-10-14T21:45:58+03:00",
      "k": "init"
    },
    {
      "t": "2026-10-14T21:46:04+03:00",
      "k": "stage",
      "id": "manifest",
      "act": "start"
    },
    {
      "t": "2026-10-14T21:51:51+03:00",
      "k": "stage",
      "id": "briefing",
      "act": "skip",
      "note": "полный автомат — самобрифинг"
    },
    {
      "t": "2026-10-14T21:51:51+03:00",
      "k": "gate",
      "g": "G1",
      "ok": true,
      "open": 0,
      "total": 5
    },
    {
      "t": "2026-10-14T21:51:51+03:00",
      "k": "stage",
      "id": "spec",
      "act": "start"
    },
    {
      "t": "2026-10-14T21:51:52+03:00",
      "k": "add",
      "key": "debt.assumptions",
      "n": 1
    },
    {
      "t": "2026-10-14T21:52:16+03:00",
      "k": "gate",
      "g": "G2",
      "ok": true,
      "found": 1,
      "fixed": 1,
      "deferred": 0
    },
    {
      "t": "2026-10-14T21:52:16+03:00",
      "k": "stage",
      "id": "plan",
      "act": "start"
    },
    {
      "t": "2026-10-14T21:52:16+03:00",
      "k": "tier",
      "v": "T1"
    },
    {
      "t": "2026-10-14T21:52:16+03:00",
      "k": "tickets",
      "n": 2
    },
    {
      "t": "2026-10-14T21:52:16+03:00",
      "k": "gate",
      "g": "G3",
      "ok": true,
      "problems": 0
    }
  ],
  "reqList": [
    {
      "id": "R01",
      "text": "«в целом прогнать, посмотреть э, сайт»",
      "status": "in-ticket"
    },
    {
      "id": "R02",
      "text": "«есть ли там какие-то моменты, где можно улучшения добавить»",
      "status": "in-ticket"
    },
    {
      "id": "R03i",
      "text": "(подразумевается: /autopilot full строит) найденные улучшения внесены на сайт",
      "status": "in-ticket"
    },
    {
      "id": "R04i",
      "text": "(подразумевается) ничего из работающего не сломано",
      "status": "in-ticket"
    },
    {
      "id": "G01",
      "text": "«Да, делаем тогда в отдельной сессии по необходимости.» — про красные e2e и PR #30",
      "status": "deferred",
      "why": "пользователь: «делаем тогда в отдельной сессии»"
    }
  ],
  "gates": {
    "G1": {
      "ok": true,
      "at": "2026-10-14T21:51:51+03:00",
      "open": 0,
      "total": 5
    },
    "G2": {
      "ok": true,
      "at": "2026-10-14T21:52:16+03:00",
      "found": 1,
      "fixed": 1,
      "deferred": 0
    },
    "G3": {
      "ok": true,
      "at": "2026-10-14T21:52:16+03:00",
      "problems": 0
    }
  },
  "result": null
}
