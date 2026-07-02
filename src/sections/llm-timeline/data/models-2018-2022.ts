import type { LlmModel } from "../types";

// ----------------------------------------------------------------------
// Landmark LLMs 2018–2022. Facts follow the «NEVER invented» rule: unknown
// numerics are `null`. Source links point at the model's own announcement /
// paper (verified), wiki links at the model/family article (ru preferred).

export const LLM_MODELS_2018_2022: LlmModel[] = [
  {
    id: "openai-gpt-1",
    slug: "gpt-1",
    vendor: "OpenAI",
    name: "GPT-1",
    releaseDate: "2018-06-11",
    contextTokens: 512,
    params: "117M",
    highlight:
      "Первая GPT: доказала, что предобучение на неразмеченном тексте + дообучение работает.",
    description:
      "GPT-1 представлена в статье «Improving Language Understanding by Generative Pre-Training» и стала первой моделью линейки generative pre-trained transformer от OpenAI. Она ввела двухэтапный подход: генеративное предобучение декодер-трансформера (12 слоёв, 117M параметров) на большом корпусе неразмеченного текста с последующим supervised-дообучением под конкретные задачи. Именно этот decoder-only рецепт лёг в основу всех последующих GPT.",
    capabilities: ["decoder-only", "pretraining", "transformer", "research"],
    sourceUrl: "https://openai.com/index/language-unsupervised/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-1",
    funFact:
      "У первой GPT было всего 117 млн параметров — даже меньше, чем у BERT-Large (340 млн), вышедшего в том же 2018 году.",
  },
  {
    id: "google-bert",
    slug: "bert",
    vendor: "Google",
    name: "BERT",
    releaseDate: "2018-10-11",
    contextTokens: 512,
    params: "340M",
    highlight:
      "Двунаправленный трансформер-энкодер, задавший стандарт предобучения в NLP.",
    description:
      "BERT (Bidirectional Encoder Representations from Transformers) представлен исследователями Google AI Language в статье на arXiv 11 октября 2018 года. Модель впервые применила глубокое двунаправленное предобучение через masked language modeling и next sentence prediction, что позволило дообучать её под конкретные задачи с минимальными изменениями. BERT установил новые state-of-the-art результаты на 11 NLP-бенчмарках (включая GLUE и SQuAD) и стал фундаментом для целого поколения энкодерных моделей. Версия BERT-Large содержала 340 млн параметров.",
    capabilities: ["encoder-only", "open-weights", "NLP", "fine-tuning"],
    sourceUrl: "https://arxiv.org/abs/1810.04805",
    wikiUrl: "https://en.wikipedia.org/wiki/BERT_(language_model)",
    funFact:
      "К октябрю 2020 года BERT обрабатывал почти каждый англоязычный поисковый запрос в Google.",
  },
  {
    id: "openai-gpt-2",
    slug: "gpt-2",
    vendor: "OpenAI",
    name: "GPT-2",
    releaseDate: "2019-02-14",
    contextTokens: 1024,
    params: "1.5B",
    highlight:
      "1.5B-модель, которую сначала «побоялись» выложить целиком из-за риска фейков.",
    description:
      "GPT-2 анонсирована 14 февраля 2019 года как языковая модель на 1.5 млрд параметров, обученная на 8 млн веб-страниц. OpenAI применила поэтапный релиз: полную модель сочли слишком опасной и выкладывали версии постепенно, полностью открыв веса лишь 5 ноября 2019 года. Модель показала связную генерацию длинного текста без дообучения под задачу и запустила публичную дискуссию о рисках генеративного ИИ.",
    capabilities: [
      "text-generation",
      "zero-shot",
      "staged-release",
      "open-weights",
    ],
    sourceUrl: "https://openai.com/index/better-language-models/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-2",
    funFact:
      "Полную GPT-2 на 1,5 млрд параметров выпустили лишь через 9 месяцев после анонса — так осторожно веса LLM ещё никто не публиковал.",
  },
  {
    id: "openai-gpt-3",
    slug: "gpt-3",
    vendor: "OpenAI",
    name: "GPT-3",
    releaseDate: "2020-05-28",
    contextTokens: 2048,
    params: "175B",
    highlight:
      "175B параметров и few-shot in-context learning без изменения весов.",
    description:
      "GPT-3 представлена в статье «Language Models are Few-Shot Learners» (arXiv, 28 мая 2020) — авторегрессионная модель на 175 млрд параметров, в 10 раз больше любой предыдущей неразреженной модели. Ключевой вывод: масштаб резко улучшает few-shot-обучение — модель решает задачи по нескольким примерам прямо в промпте, без градиентных обновлений. Она задала архитектурную базу для API OpenAI и последующего ChatGPT.",
    capabilities: ["few-shot", "in-context-learning", "175B", "api"],
    sourceUrl: "https://arxiv.org/abs/2005.14165",
    wikiUrl: "https://ru.wikipedia.org/wiki/GPT-3",
    funFact:
      "Обучение GPT-3 обошлось в миллионы долларов, но найденную позже ошибку в данных решили не исправлять — переобучать было слишком дорого.",
  },
  {
    id: "google-palm",
    slug: "palm",
    vendor: "Google",
    name: "PaLM",
    releaseDate: "2022-04-04",
    contextTokens: 2048,
    params: "540B",
    highlight:
      "Плотная модель на 540 млрд параметров, обученная на системе Pathways.",
    description:
      "PaLM (Pathways Language Model) анонсирована Google Research 4 апреля 2022 года в блоге компании (статья на arXiv опубликована 5 апреля). Это плотный авторегрессионный трансформер на 540 млрд параметров, обученный на 780 млрд токенов с помощью новой системы Pathways на двух подах TPU v4. PaLM продемонстрировала прорывные результаты в многошаговом рассуждении с chain-of-thought промптингом и превзошла среднего человека на бенчмарке BIG-bench. Модель обучалась также в масштабах 8B и 62B параметров для изучения законов масштабирования.",
    capabilities: [
      "reasoning",
      "code",
      "multilingual",
      "few-shot",
      "chain-of-thought",
    ],
    sourceUrl: "https://arxiv.org/abs/2204.02311",
    wikiUrl: "https://ru.wikipedia.org/wiki/PaLM",
    funFact:
      "PaLM обучали сразу на 6144 чипах TPU v4 через новую систему Pathways — отсюда и название модели (Pathways Language Model).",
  },
  {
    id: "openai-gpt-3-5",
    slug: "gpt-3-5",
    vendor: "OpenAI",
    name: "GPT-3.5 / ChatGPT",
    releaseDate: "2022-11-30",
    contextTokens: 4096,
    params: null,
    highlight:
      "Запуск ChatGPT — самый быстрый в истории выход продукта на миллион пользователей.",
    description:
      "30 ноября 2022 года OpenAI выпустила ChatGPT — диалогового ассистента, дообученного от модели серии GPT-3.5 с помощью RLHF (обучение с подкреплением на человеческой обратной связи). Диалоговый формат позволил модели вести беседу, признавать ошибки и отклонять недопустимые запросы. За пять дней сервис набрал более миллиона пользователей и запустил массовую волну интереса к генеративному ИИ.",
    capabilities: ["chat", "RLHF", "instruction-following", "assistant"],
    sourceUrl: "https://openai.com/index/chatgpt/",
    wikiUrl: "https://ru.wikipedia.org/wiki/ChatGPT",
    funFact:
      "ChatGPT набрал 100 млн пользователей за два месяца — по оценке UBS, на тот момент исторический рекорд роста аудитории.",
  },
  {
    id: "google-t5",
    slug: "t5",
    vendor: "Google",
    name: "T5",
    releaseDate: "2019-10-23",
    contextTokens: null,
    params: "11B",
    highlight:
      "Единый text-to-text формат: любая NLP-задача — как преобразование текста в текст.",
    description:
      "Google представила T5 (Text-to-Text Transfer Transformer) — encoder-decoder модель, сводящую все NLP-задачи к единому формату «текст на входе — текст на выходе»: перевод, суммаризация, классификация и вопросы-ответы решаются одной моделью. Семейство из пяти размеров масштабировалось до 11 млрд параметров и обучалось на корпусе C4 (Colossal Clean Crawled Corpus), представленном в той же работе. Подход закрепил парадигму универсальных предобученных моделей и переноса знаний.",
    capabilities: [
      "text-to-text",
      "transfer-learning",
      "encoder-decoder",
      "open-weights",
    ],
    sourceUrl: "https://arxiv.org/abs/1910.10683",
    wikiUrl: "https://en.wikipedia.org/wiki/T5_(language_model)",
    funFact:
      "Представленный вместе с T5 корпус C4 позже стал стандартным датасетом для предобучения десятков других открытых моделей.",
  },
  {
    id: "openai-instructgpt",
    slug: "instructgpt",
    vendor: "OpenAI",
    name: "InstructGPT",
    releaseDate: "2022-01-27",
    contextTokens: null,
    params: "1.3B–175B",
    highlight:
      "RLHF-выравнивание на человеческих оценках — прямой предшественник ChatGPT.",
    description:
      "OpenAI показала, как дообучить GPT-3 следовать инструкциям с помощью RLHF — обучения с подкреплением на основе человеческой обратной связи. Оценщики предпочитали ответы InstructGPT с 1,3 млрд параметров ответам GPT-3 со 175 млрд — модели в 100 раз крупнее. 27 января 2022 года InstructGPT-модели стали моделями по умолчанию в API OpenAI, а сама методика легла в основу ChatGPT.",
    capabilities: [
      "RLHF",
      "instruction-following",
      "alignment",
      "human-feedback",
    ],
    sourceUrl: "https://arxiv.org/abs/2203.02155",
    wikiUrl: null,
    funFact:
      "Люди-оценщики предпочитали ответы InstructGPT на 1,3 млрд параметров ответам GPT-3 на 175 млрд — модели в 100 раз больше.",
  },
  {
    id: "deepmind-chinchilla",
    slug: "chinchilla",
    vendor: "DeepMind",
    name: "Chinchilla",
    releaseDate: "2022-03-29",
    contextTokens: null,
    params: "70B",
    highlight:
      "Компьют-оптимальное масштабирование: 70B на 1,4 трлн токенов обошла Gopher 280B.",
    description:
      "DeepMind показала, что крупные LLM систематически недообучены: при фиксированном компьюте размер модели и объём данных нужно наращивать пропорционально — удвоил параметры, удвой и токены. Chinchilla с 70 млрд параметров, обученная на 1,4 трлн токенов, обошла Gopher (280B), GPT-3 (175B) и Megatron-Turing NLG (530B). «Законы Шиншиллы» изменили то, как индустрия планирует обучение моделей.",
    capabilities: ["scaling-laws", "compute-optimal", "research", "few-shot"],
    sourceUrl: "https://arxiv.org/abs/2203.15556",
    wikiUrl: "https://en.wikipedia.org/wiki/Chinchilla_(language_model)",
    funFact:
      "При том же бюджете вычислений, что у Gopher 280B, Chinchilla 70B набрала 67,5% на MMLU — более чем на 7 п.п. выше Gopher.",
  },
  {
    id: "bigscience-bloom",
    slug: "bloom",
    vendor: "BigScience",
    name: "BLOOM",
    releaseDate: "2022-07-12",
    contextTokens: 2048,
    params: "176B",
    highlight:
      "Открытая многоязычная модель на 176B, созданная 1000+ исследователями из 70+ стран.",
    description:
      "BigScience — открытая коллаборация более 1000 исследователей из 70+ стран, координируемая Hugging Face, — выпустила BLOOM на 176 млрд параметров. Модель генерирует текст на 46 естественных языках и 13 языках программирования и на момент выхода была крупнейшей открытой многоязычной LLM. Обучение прошло на французском государственном суперкомпьютере Jean Zay при финансовой поддержке правительства Франции.",
    capabilities: ["open-weights", "multilingual", "code", "community-driven"],
    sourceUrl: "https://huggingface.co/blog/bloom",
    wikiUrl: "https://en.wikipedia.org/wiki/BLOOM_(language_model)",
    funFact:
      "Финальный прогон обучения BLOOM длился 117 дней (11 марта — 6 июля 2022) на суперкомпьютере Jean Zay под Парижем.",
  },
];
