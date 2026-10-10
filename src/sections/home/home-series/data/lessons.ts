import type { SeriesLesson } from "../types";

// ----------------------------------------------------------------------

export const SERIES_LESSONS: SeriesLesson[] = [
  {
    number: 1,
    title: { ru: "Что такое нейросеть", en: "What a neural network is" },
    questions: [
      {
        id: "1-1",
        text: {
          ru: "Нейросеть, которая узнаёт шпица, сама находит закономерности на примерах?",
          en: "Does a neural network that recognizes a Pomeranian find the patterns itself, from examples?",
        },
        answer: true,
        why: {
          ru: "Да. Правило «острые уши, пушистый хвост, рыжая шерсть» ей никто не писал: закономерности она нашла на примерах.",
          en: "Yes. Nobody gave it a rule like pointed ears, a fluffy tail and red fur. It found the patterns in examples.",
        },
      },
      {
        id: "1-2",
        text: {
          ru: "Нейросети работают только с текстом?",
          en: "Do neural networks work only with text?",
        },
        answer: false,
        why: {
          ru: "Нет. Нейросети применяют и к изображениям, и к звуку: например, по картинке узнают собаку.",
          en: "No. Neural networks are also used with images and sound, for example to recognize a dog in a picture.",
        },
      },
      {
        id: "1-3",
        text: {
          ru: "Внутри нейросети работает живой мозг или спрятанный человек?",
          en: "Is there a living brain or a hidden person inside a neural network?",
        },
        answer: false,
        why: {
          ru: "Нет. Это модель, которая учится на примерах. Человека или живого мозга внутри нет.",
          en: "No. It is a model that learns from examples. There is no person or living brain inside.",
        },
      },
    ],
  },
  {
    number: 2,
    title: {
      ru: "Как нейросеть учится на примерах",
      en: "How a neural network learns from examples",
    },
    questions: [
      {
        id: "2-1",
        text: {
          ru: "В примере с рукописными семёрками модель учат без правильных ответов?",
          en: "In the handwritten sevens example, is the model trained without any correct answers?",
        },
        answer: false,
        why: {
          ru: "Нет. Для каждой семёрки известен правильный ответ: с ним сравнивают ответ модели и при ошибке меняют её настройки.",
          en: "No. The correct answer is known for every seven. The model's answer is compared with it, and after a mistake its settings change a little.",
        },
      },
      {
        id: "2-2",
        text: {
          ru: "Обученная модель отвечает на новую семёрку с уже найденными настройками?",
          en: "Does a trained model answer a new seven using the settings it has already found?",
        },
        answer: true,
        why: {
          ru: "Да. В момент применения настройки не меняются: они найдены раньше, во время обучения.",
          en: "Yes. While the model is being used, its settings do not change. They were found earlier, during training.",
        },
      },
      {
        id: "2-3",
        text: {
          ru: "Ответ на новое сообщение означает, что модель заново обучилась?",
          en: "Does a reply to a new message mean the model has been trained again?",
        },
        answer: false,
        why: {
          ru: "Нет. Ваше сообщение влияет на ответ, но не меняет настройки модели. Обучение идёт отдельно.",
          en: "No. Your message shapes the reply but does not change the model's settings. Training happens separately.",
        },
      },
    ],
  },
  {
    number: 3,
    title: {
      ru: "LLM: нейросеть для языка",
      en: "LLM: a neural network for language",
    },
    questions: [
      {
        id: "3-1",
        text: {
          ru: "Связный, красиво написанный ответ обязательно верный?",
          en: "Is a smooth, well-written answer always correct?",
        },
        answer: false,
        why: {
          ru: "Нет. Связный текст ещё не значит верный. В красивом ответе бывает ошибка, поэтому факты проверяют отдельно.",
          en: "No. Smooth text is not necessarily correct. A nicely written answer can contain a mistake, so facts are checked separately.",
        },
      },
      {
        id: "3-2",
        text: {
          ru: "LLM по-русски значит «большая языковая модель»: нейросеть, которую обучили работать с текстом?",
          en: "Does LLM stand for large language model, a neural network trained to work with text?",
        },
        answer: true,
        why: {
          ru: "Да. LLM: large language model. Эту нейросеть обучили на большом количестве текстов работать с языком.",
          en: "Yes. LLM stands for large language model: a neural network trained on a large amount of text to work with language.",
        },
      },
      {
        id: "3-3",
        text: {
          ru: "Языковая модель учитывает текст до этого места, поэтому одна и та же фраза может продолжиться по-разному?",
          en: "Does a language model take the text so far into account, so the same phrase can continue in different ways?",
        },
        answer: true,
        why: {
          ru: "Да. Модель пишет ответ по частям и каждый раз учитывает текст до этого места, поэтому от него зависит продолжение.",
          en: "Yes. The model writes its answer in parts and each time takes the earlier text into account, so the continuation depends on it.",
        },
      },
    ],
  },
  {
    number: 4,
    title: {
      ru: "ChatGPT, Claude и модель: что вы открываете",
      en: "ChatGPT, Claude and the model: what you open",
    },
    questions: [
      {
        id: "4-1",
        text: {
          ru: "Слово Claude может означать и модели компании Anthropic, и приложение-помощник?",
          en: "Can the word Claude mean both Anthropic's models and a chat assistant app?",
        },
        answer: true,
        why: {
          ru: "Да. Поэтому уточняйте, о чём речь: о модели Claude или о чате с Claude.",
          en: "Yes. So check which one is meant: the Claude model or a chat with Claude.",
        },
      },
      {
        id: "4-2",
        text: {
          ru: "Окно чата и модель: это одно и то же?",
          en: "Are the chat window and the model the same thing?",
        },
        answer: false,
        why: {
          ru: "Нет. Окно, история разговора и кнопка для файлов относятся к приложению. Ответ даёт модель, которая работает внутри него.",
          en: "No. The window, the conversation history and the file button belong to the app. The model works inside it and writes the answer.",
        },
      },
      {
        id: "4-3",
        text: {
          ru: "Набор функций, например поиск и работа с файлами, одинаков в любом чат-приложении?",
          en: "Is the set of features, such as search and file handling, the same in every chat app?",
        },
        answer: false,
        why: {
          ru: "Нет. Приложение добавляет вокруг модели разговор, работу с файлами, иногда поиск. Набор функций зависит от приложения и настроек.",
          en: "No. An app adds conversation, file handling and sometimes search around the model. The set of features depends on the app and its settings.",
        },
      },
    ],
  },
  {
    number: 5,
    title: {
      ru: "Что написать нейросети, чтобы получить полезный ответ",
      en: "What to write to get a useful answer",
    },
    questions: [
      {
        id: "5-1",
        text: {
          ru: "Если добавить в запрос цель и условия, результат обязательно получится идеальным?",
          en: "If you add a goal and conditions to your request, will the result be perfect?",
        },
        answer: false,
        why: {
          ru: "Нет. Условия не гарантируют идеальный результат, но направляют ответ.",
          en: "No. Conditions do not guarantee a perfect result, but they steer the answer.",
        },
      },
      {
        id: "5-2",
        text: {
          ru: "Слова «запрос» и «промпт» означают одно и то же: сообщение с задачей для нейросети?",
          en: "Do the words request and prompt mean the same thing: a message that gives a neural network a task?",
        },
        answer: true,
        why: {
          ru: "Да. Сообщение с задачей для нейросети называют запросом, или промптом.",
          en: "Yes. A message that gives a neural network a task is called a request, or a prompt.",
        },
      },
      {
        id: "5-3",
        text: {
          ru: "Если нужен короткий ответ, стоит написать, какой длины или в каком формате он нужен?",
          en: "If you want a short answer, should you say what length or format you need?",
        },
        answer: true,
        why: {
          ru: "Да. В примере попросили список из пяти пунктов без пояснений, и ответ уместился в пять строк.",
          en: "Yes. In the example, the request asked for a list of five items with no explanations, and the answer fit into five lines.",
        },
      },
    ],
  },
  {
    number: 6,
    title: {
      ru: "Почему нейросеть может уверенно ошибаться",
      en: "Why a neural network can be confidently wrong",
    },
    questions: [
      {
        id: "6-1",
        text: {
          ru: "Важные даты, числа и ссылки из ответа нейросети стоит проверять по первоисточнику?",
          en: "Should you check important dates, numbers and links from a neural network's answer against the original source?",
        },
        answer: true,
        why: {
          ru: "Да. Например, по сайту компании, документу или официальной странице.",
          en: "Yes. For example, on the company website, in a document or on an official page.",
        },
      },
      {
        id: "6-2",
        text: {
          ru: "Уверенный тон ответа означает, что факт проверен?",
          en: "Does a confident tone mean the fact has been checked?",
        },
        answer: false,
        why: {
          ru: "Нет. Гладкий уверенный текст сам по себе факт не подтверждает. Проверять нужно по источнику.",
          en: "No. Smooth, confident text does not confirm a fact by itself. Check it against a source.",
        },
      },
      {
        id: "6-3",
        text: {
          ru: "Если нейросеть привела ссылку на источник, факт уже подтверждён?",
          en: "If a neural network gives a link to a source, is the fact already confirmed?",
        },
        answer: false,
        why: {
          ru: "Нет. В примере нейросеть сама предупредила, что ссылку не открывала. Дату пришлось сверить на странице.",
          en: "No. In the example, the neural network itself warned that it had not opened the link. The date had to be checked on the page.",
        },
      },
    ],
  },
  {
    number: 7,
    title: {
      ru: "Первый полезный опыт с AI",
      en: "Your first useful experience with AI",
    },
    questions: [
      {
        id: "7-1",
        text: {
          ru: "После первого ответа можно уточнить один пункт, например перенести встречу на утро?",
          en: "After the first answer, can you ask to change one item, for example to move a meeting to the morning?",
        },
        answer: true,
        why: {
          ru: "Да. В примере так и сделали, и нейросеть пересобрала весь план.",
          en: "Yes. That is what happened in the example, and the neural network rebuilt the whole plan.",
        },
      },
      {
        id: "7-2",
        text: {
          ru: "После уточнения условия задачи сверять уже не нужно?",
          en: "After a clarification, is there no need to check the conditions again?",
        },
        answer: false,
        why: {
          ru: "Нет. План пересобрался, поэтому условия нужно сверить снова: например, что бассейн работает до 14:00.",
          en: "No. The plan was rebuilt, so check the conditions again: for example, that the pool is open only until 2 p.m.",
        },
      },
      {
        id: "7-3",
        text: {
          ru: "Для первой пробы подойдёт небольшая задача без личных данных?",
          en: "Is a small task with no personal data a good choice for a first try?",
        },
        answer: true,
        why: {
          ru: "Да. Например, меню на три дня, список покупок или план уборки.",
          en: "Yes. For example, a three-day menu, a shopping list or a cleaning plan.",
        },
      },
    ],
  },
  {
    number: 8,
    title: { ru: "Что значит AI-агент", en: "What an AI agent is" },
    questions: [
      {
        id: "8-1",
        text: {
          ru: "В этой серии агент складывается из модели, инструментов и программы, которая ведёт шаги?",
          en: "In this series, is an agent made of a model, tools and a program that runs the steps?",
        },
        answer: true,
        why: {
          ru: "Да. Модель выбирает следующий шаг, а инструмент читает или меняет файл. Это упрощённая схема.",
          en: "Yes. The model picks the next step and a tool reads or changes a file. This is a simplified scheme.",
        },
      },
      {
        id: "8-2",
        text: {
          ru: "Агент может не только предложить текст, но и выполнить действие, например создать файл?",
          en: "Can an agent do more than suggest text, for example carry out an action such as creating a file?",
        },
        answer: true,
        why: {
          ru: "Да. В примере агент прочитал notes.md и создал рядом plan.md. Что ему можно, решают разрешения.",
          en: "Yes. In the example, the agent read notes.md and created plan.md next to it. Permissions decide what it may do.",
        },
      },
      {
        id: "8-3",
        text: {
          ru: "Модель сама по себе получает доступ ко всем файлам компьютера?",
          en: "Does a model get access to all the files on a computer by itself?",
        },
        answer: false,
        why: {
          ru: "Нет. Доступ дают инструменты программы и её настройки.",
          en: "No. Access comes from the program's tools and its settings.",
        },
      },
    ],
  },
  {
    number: 9,
    title: {
      ru: "Claude Code: помощник в папке проекта",
      en: "Claude Code: a helper in a project folder",
    },
    questions: [
      {
        id: "9-1",
        text: {
          ru: "В примере Claude Code открыл все файлы в папке, в том числе рецепты и бюджет?",
          en: "In the example, did Claude Code open every file in the folder, including the recipes and the budget?",
        },
        answer: false,
        why: {
          ru: "Нет. Задача была ограниченной: он прочитал только заметки и создал рядом plan.md.",
          en: "No. The task was limited: it read only the notes and created plan.md next to them.",
        },
      },
      {
        id: "9-2",
        text: {
          ru: "После работы агента стоит посмотреть само изменение и то, какие файлы затронуты?",
          en: "After an agent has worked, should you look at the change itself and at which files were touched?",
        },
        answer: true,
        why: {
          ru: "Да. Проверьте, совпадает ли изменение с задачей и какие файлы затронуты.",
          en: "Yes. Check whether the change matches the task and which files were affected.",
        },
      },
      {
        id: "9-3",
        text: {
          ru: "Claude Code и окно чата с Claude: это одно и то же?",
          en: "Are Claude Code and a chat window with Claude the same thing?",
        },
        answer: false,
        why: {
          ru: "Нет. Claude Code: программа компании Anthropic, которая с помощью моделей Claude работает с папкой проекта.",
          en: "No. Claude Code is a program from Anthropic that uses Claude models to work with a project folder.",
        },
      },
    ],
  },
  {
    number: 10,
    title: {
      ru: "Codex: агент OpenAI для работы с проектом",
      en: "Codex: an OpenAI agent for project work",
    },
    questions: [
      {
        id: "10-1",
        text: {
          ru: "Если настройки требуют подтверждать команды, а подтвердить некому, агент всё равно их выполнит?",
          en: "If the settings require commands to be confirmed and nobody is there to confirm, will the agent run them anyway?",
        },
        answer: false,
        why: {
          ru: "Нет. В примере Codex остановился и честно написал, что plan.md не создан и файлы не изменены.",
          en: "No. In the example, Codex stopped and said honestly that plan.md was not created and no files were changed.",
        },
      },
      {
        id: "10-2",
        text: {
          ru: "Claude Code и Codex: это названия одной программы?",
          en: "Are Claude Code and Codex two names for the same program?",
        },
        answer: false,
        why: {
          ru: "Нет. Это разные продукты разных компаний, Anthropic и OpenAI, с похожей идеей работы агента.",
          en: "No. They are different products from different companies, Anthropic and OpenAI, built on a similar idea of how an agent works.",
        },
      },
      {
        id: "10-3",
        text: {
          ru: "Codex от OpenAI умеет читать и менять файлы, а не только отвечать в чате?",
          en: "Can Codex from OpenAI read and change files, not just reply in a chat?",
        },
        answer: true,
        why: {
          ru: "Да. С помощью модели он читает и меняет файлы, запускает команды и проверки там, куда ему дали доступ.",
          en: "Yes. Using a model, it reads and changes files and runs commands and checks wherever it has been given access.",
        },
      },
    ],
  },
  {
    number: 11,
    title: {
      ru: "Как Claude Code и Codex выполняют задачу",
      en: "How Claude Code and Codex carry out a task",
    },
    questions: [
      {
        id: "11-1",
        text: {
          ru: "Работу агента удобно представить как цикл: выбрать шаг, выполнить его, посмотреть результат?",
          en: "Is it handy to picture an agent's work as a loop: pick a step, carry it out, look at the result?",
        },
        answer: true,
        why: {
          ru: "Да. Это учебная схема: в разных программах шаги отличаются.",
          en: "Yes. This is a teaching scheme: the steps differ from program to program.",
        },
      },
      {
        id: "11-2",
        text: {
          ru: "Сообщения «готово» достаточно, чтобы считать работу правильной?",
          en: "Is a message saying the work is done enough to treat it as correct?",
        },
        answer: false,
        why: {
          ru: "Нет. Нужно посмотреть результат и проверить его так, как подходит задаче.",
          en: "No. You need to look at the result and check it in a way that suits the task.",
        },
      },
      {
        id: "11-3",
        text: {
          ru: "В цикле модель предлагает следующий шаг, а выполняет его программа с разрешённым инструментом?",
          en: "In the loop, does the model suggest the next step while the program carries it out with an allowed tool?",
        },
        answer: true,
        why: {
          ru: "Да. Потом результат возвращается в цикл, и агент решает, продолжать или закончить.",
          en: "Yes. Then the result goes back into the loop, and the agent decides whether to continue or finish.",
        },
      },
    ],
  },
  {
    number: 12,
    title: {
      ru: "Первый мини-проект: папка для контента",
      en: "First mini-project: a content folder",
    },
    questions: [
      {
        id: "12-1",
        text: {
          ru: "Перед задачей для агента полезно назвать цель и границы: какие файлы, какой язык, что нельзя выдумывать?",
          en: "Before giving an agent a task, is it useful to state the goal and limits: which files, which language, what must not be invented?",
        },
        answer: true,
        why: {
          ru: "Да. В примере: только два файла, по-русски, без выдуманных цифр и ссылок, а где нужен факт, пометка «проверить».",
          en: "Yes. In the example: only two files, in Russian, no invented numbers or links, and a note to check wherever a fact is needed.",
        },
      },
      {
        id: "12-2",
        text: {
          ru: "В мини-проекте агент сам публикует готовые посты?",
          en: "In the mini-project, does the agent publish the finished posts by itself?",
        },
        answer: false,
        why: {
          ru: "Нет. Агент быстро собирает черновик, а проверка и публикация остаются за вами.",
          en: "No. The agent quickly builds a draft, and checking and publishing stay with you.",
        },
      },
      {
        id: "12-3",
        text: {
          ru: "Если в результате агента есть утверждение без источника, его стоит сверить до публикации?",
          en: "If an agent's result contains a claim with no source, should you check it before publishing?",
        },
        answer: true,
        why: {
          ru: "Да. В примере так отметили «перелив опаснее недолива»: перед публикацией это нужно сверить с источником.",
          en: "Yes. In the example, the claim that overwatering is worse than underwatering was marked: it needs checking against a source before publishing.",
        },
      },
    ],
  },
];
