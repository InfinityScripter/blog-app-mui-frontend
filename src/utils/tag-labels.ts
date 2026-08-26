import { DEFAULT_LOCALE, type AppLocale } from "src/i18n/locales";

// Английские подписи для тегов постов.
//
// Тег — это ещё и АДРЕС: paths.tag.details() кодирует его в /tag/<тег>/, по нему
// же строятся карта сайта, hreflang-альтернативы и запрос постов к бэкенду.
// Поэтому переводится только подпись на экране, а сам тег везде остаётся
// исходным русским — иначе разъехались бы ссылки, роутинг и выдача.
//
// Словарь неполон по устройству: бот придумывает теги сам, и новый тег появится
// раньше, чем строка здесь. Незнакомый тег показывается как есть — русское
// слово на английской странице хуже перевода, но несравнимо лучше пустоты.
// Ключи в нижнем регистре, поиск регистронезависимый.
const EN_LABELS: Record<string, string> = {
  новости: "News",
  разработка: "Development",
  агенты: "Agents",
  безопасность: "Security",
  бизнес: "Business",
  нейросети: "Neural networks",
  технологии: "Technology",
  "наука и техника": "Science and technology",
  наука: "Science",
  гаджеты: "Gadgets",
  политика: "Politics",
  культура: "Culture",
  ии: "AI",
  "3d-сканирование": "3D scanning",
  автоматизация: "Automation",
  "дата-центры": "Data centres",
  медицина: "Medicine",
  микроконтроллеры: "Microcontrollers",
  опыт: "Experience",
  продуктивность: "Productivity",
  регулирование: "Regulation",
  рутина: "Routine",
  сотрудники: "Employees",
  "тернарные нейросети": "Ternary neural networks",
  ультразвук: "Ultrasound",
  хабр: "Habr",
};

const LABELS_BY_LOCALE: Partial<Record<AppLocale, Record<string, string>>> = {
  en: EN_LABELS,
};

/**
 * Подпись тега для показа в интерфейсе. Русский — оригинал, возвращается как
 * есть; для остальных локалей ищется перевод, а без него — снова сам тег.
 * Чистая функция: одинаково работает и в серверном, и в клиентском компоненте.
 */
export function tagLabel(
  tag: string,
  locale: AppLocale = DEFAULT_LOCALE,
): string {
  const labels = LABELS_BY_LOCALE[locale];
  return labels?.[tag.toLowerCase()] ?? tag;
}
