window.STATE =
{
  "version": 2,
  "slug": "site-improvements",
  "dir": "2026-10-14-site-improvements",
  "title": "Улучшения сайта aifirst.us.com",
  "mode": "full",
  "depth": "normal",
  "tier": "T1",
  "briefFile": "2026-10-14-brief.md",
  "memoryFile": "CLAUDE.md",
  "memoryOwner": "user",
  "skillDir": "/Users/kot/.claude/skills/autopilot",
  "baseCommit": "8a9f0b4",
  "startedAt": "2026-10-14T21:45:58+03:00",
  "updatedAt": "2026-10-14T22:08:16+03:00",
  "finishedAt": "2026-10-14T22:08:16+03:00",
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
      "status": "done",
      "startedAt": "2026-10-14T21:52:16+03:00",
      "finishedAt": "2026-10-14T21:52:16+03:00"
    },
    {
      "id": "build",
      "status": "done",
      "startedAt": "2026-10-14T21:52:16+03:00",
      "finishedAt": "2026-10-14T22:02:26+03:00"
    },
    {
      "id": "review",
      "status": "done",
      "startedAt": "2026-10-14T22:02:26+03:00",
      "finishedAt": "2026-10-14T22:03:53+03:00"
    },
    {
      "id": "final",
      "status": "done",
      "startedAt": "2026-10-14T22:03:53+03:00",
      "finishedAt": "2026-10-14T22:08:16+03:00"
    }
  ],
  "requirements": {
    "total": 5,
    "done": 4,
    "inTicket": 0,
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "startedAt": "2026-10-14T21:52:16+03:00",
      "finishedAt": "2026-10-14T21:55:50+03:00",
      "tests": {
        "passed": 268,
        "failed": 0
      },
      "commit": "16f0380"
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "startedAt": "2026-10-14T21:52:16+03:00",
      "finishedAt": "2026-10-14T21:54:09+03:00",
      "tests": {
        "passed": 6,
        "failed": 0
      },
      "commit": "1b692b9"
    }
  ],
  "tests": {
    "passed": 268,
    "failed": 0
  },
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
  "blind": {
    "checked": 4,
    "matched": 3,
    "mismatches": [
      "R03i — частично: улучшения узкие (поиск, подписи, картинки новостей); главная и сравнение LLM по скорости почти не менялись"
    ]
  },
  "beats": [
    "2026-10-14T21:45:58+03:00",
    "2026-10-14T21:46:04+03:00",
    "2026-10-14T21:46:11+03:00",
    "2026-10-14T21:51:51+03:00",
    "2026-10-14T21:51:52+03:00",
    "2026-10-14T21:52:16+03:00",
    "2026-10-14T21:54:09+03:00",
    "2026-10-14T21:55:50+03:00",
    "2026-10-14T22:02:26+03:00",
    "2026-10-14T22:03:53+03:00",
    "2026-10-14T22:08:16+03:00"
  ],
  "rev": 24,
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
    },
    {
      "t": "2026-10-14T21:52:16+03:00",
      "k": "stage",
      "id": "build",
      "act": "start"
    },
    {
      "t": "2026-10-14T21:52:16+03:00",
      "k": "ticket",
      "ids": [
        "01",
        "02"
      ],
      "act": "start"
    },
    {
      "t": "2026-10-14T21:54:09+03:00",
      "k": "ticket",
      "ids": [
        "02"
      ],
      "act": "done",
      "tests": {
        "passed": 6,
        "failed": 0
      }
    },
    {
      "t": "2026-10-14T21:55:50+03:00",
      "k": "ticket",
      "ids": [
        "01"
      ],
      "act": "done",
      "tests": {
        "passed": 268,
        "failed": 0
      }
    },
    {
      "t": "2026-10-14T22:02:26+03:00",
      "k": "add",
      "key": "report",
      "n": 1
    },
    {
      "t": "2026-10-14T22:02:26+03:00",
      "k": "stage",
      "id": "review",
      "act": "start"
    },
    {
      "t": "2026-10-14T22:03:53+03:00",
      "k": "add",
      "key": "report",
      "n": 6
    },
    {
      "t": "2026-10-14T22:03:53+03:00",
      "k": "stage",
      "id": "final",
      "act": "start"
    },
    {
      "t": "2026-10-14T22:08:16+03:00",
      "k": "gate",
      "g": "G4",
      "ok": false,
      "checked": 4,
      "matched": 3
    },
    {
      "t": "2026-10-14T22:08:16+03:00",
      "k": "tests",
      "passed": 268,
      "failed": 0
    },
    {
      "t": "2026-10-14T22:08:16+03:00",
      "k": "finish",
      "result": "Чейнджлог и юр. страницы правильно видны поисковику, у иконок есть подписи, новости грузятся быстрее"
    }
  ],
  "reqList": [
    {
      "id": "R01",
      "text": "«в целом прогнать, посмотреть э, сайт»",
      "status": "done"
    },
    {
      "id": "R02",
      "text": "«есть ли там какие-то моменты, где можно улучшения добавить»",
      "status": "done"
    },
    {
      "id": "R03i",
      "text": "(подразумевается: /autopilot full строит) найденные улучшения внесены на сайт",
      "status": "done"
    },
    {
      "id": "R04i",
      "text": "(подразумевается) ничего из работающего не сломано",
      "status": "done"
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
    },
    "G4": {
      "ok": false,
      "at": "2026-10-14T22:08:16+03:00",
      "checked": 4,
      "matched": 3
    }
  },
  "result": "Чейнджлог и юр. страницы правильно видны поисковику, у иконок есть подписи, новости грузятся быстрее",
  "report": [
    "Страница новостей: главный элемент 8,0 с вместо 11,6 с на одной машине (медиана трёх замеров), вес −269 КБ; до нормы 2,5 с ещё далеко — остальное время уходит на скрипты и загрузку самой картинки",
    "Первая картинка новостей теперь 800 px: быстрее, но на ретина-экране компьютера может быть чуть мягче (нужно ~1060 px)",
    "/en/privacy-policy и /en/personal-data-consent: текст русский, а поисковику они названы английской версией — перевести или убрать английскую версию",
    "Кнопка «…» у своего комментария без подписи — видна только автору после входа",
    "Ширина подставляется только для images.unsplash.com, не для plus.unsplash.com",
    "Скрытие дублирующей ссылки-картинки и правка юр. страниц не закреплены юнит-тестами — проверены в браузере",
    "Для тестов добавлено описание типов react-dom/server вместо установки @types/react-dom (package.json не трогали)"
  ]
}
