// Иконка и цвет для каждой категории расходов и источника дохода.
// Ключи — ровно те строки, что выдаёт классификатор на бэкенде
// (services/finance-classify.ts): новая категория там без записи здесь просто
// получит нейтральный фолбэк, страница не сломается.

export type FinanceIconColor =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface FinanceIcon {
  icon: string;
  color: FinanceIconColor;
}

const FALLBACK_ICON: FinanceIcon = {
  icon: "solar:widget-4-bold",
  color: "secondary",
};

const BUCKET_ICONS: Record<string, FinanceIcon> = {
  "Продукты (супермаркеты)": {
    icon: "solar:cart-large-2-bold",
    color: "success",
  },
  "Снятие наличных": { icon: "solar:banknote-2-bold", color: "warning" },
  "ЖКХ и квартира": { icon: "solar:home-2-bold", color: "info" },
  "Переводы другим людям": {
    icon: "solar:users-group-rounded-bold",
    color: "secondary",
  },
  "Переводы Елене (семья)": { icon: "solar:heart-bold", color: "error" },
  Аптеки: { icon: "solar:pill-bold", color: "error" },
  "Медицина (клиники)": { icon: "solar:stethoscope-bold", color: "error" },
  Питомцы: { icon: "solar:paw-bold", color: "warning" },
  "Кафе, фастфуд, доставка": { icon: "solar:cup-hot-bold", color: "warning" },
  Налоги: { icon: "solar:bill-list-bold", color: "secondary" },
  Госпошлины: { icon: "solar:shield-check-bold", color: "secondary" },
  "Авто: ремонт и сервис": { icon: "solar:wheel-bold", color: "info" },
  "Авто: топливо и мойка": { icon: "solar:gas-station-bold", color: "info" },
  "Транспорт и такси": { icon: "solar:bus-bold", color: "info" },
  "Одежда и обувь": { icon: "solar:t-shirt-bold", color: "secondary" },
  "Красота и уход": { icon: "solar:scissors-bold", color: "secondary" },
  "Связь и интернет": { icon: "solar:wi-fi-router-bold", color: "info" },
  "Подписки и домены": { icon: "solar:refresh-circle-bold", color: "primary" },
  "ИИ-инструменты": { icon: "solar:cpu-bolt-bold", color: "primary" },
  Маркетплейсы: { icon: "solar:bag-4-bold", color: "warning" },
  Путешествия: { icon: "solar:suitcase-tag-bold", color: "info" },
  Страховки: { icon: "solar:shield-keyhole-bold", color: "success" },
  "Комиссии и финсервисы": { icon: "solar:card-bold", color: "secondary" },
  "Игры и цифровые товары": { icon: "solar:gamepad-bold", color: "primary" },
  "Цветы и подарки": { icon: "solar:gift-bold", color: "error" },
  "Дом и ремонт": { icon: "solar:paint-roller-bold", color: "warning" },
  "Хозтовары и разное": { icon: "solar:box-bold", color: "secondary" },
  Остальное: FALLBACK_ICON,
};

const INCOME_ICONS: Record<string, FinanceIcon> = {
  Зарплата: { icon: "solar:case-bold", color: "success" },
  "ИП Егоровой": { icon: "solar:hand-money-bold", color: "success" },
  "Проценты по вкладу": { icon: "solar:graph-up-bold", color: "success" },
  "Кэшбэк и бонусы": {
    icon: "solar:confetti-minimalistic-bold",
    color: "warning",
  },
  "Возвраты от государства": { icon: "solar:bill-check-bold", color: "info" },
  "Переводы от людей": {
    icon: "solar:users-group-rounded-bold",
    color: "secondary",
  },
};

export function bucketIcon(bucket: string): FinanceIcon {
  return BUCKET_ICONS[bucket] ?? FALLBACK_ICON;
}

export function incomeIcon(source: string): FinanceIcon {
  return (
    INCOME_ICONS[source] ?? {
      icon: "solar:wallet-money-bold",
      color: "success",
    }
  );
}
