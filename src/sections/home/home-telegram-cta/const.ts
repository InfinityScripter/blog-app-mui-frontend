import { CONFIG } from "src/config-global";

// TODO: заменить на ссылку Telegram-канала, когда будет готова. Пока ведёт на
// личный аккаунт (тот же, что в футере).
export const TELEGRAM_URL = CONFIG.social.telegram;

// Copy (label / title / text / button) is resolved per-locale in
// `HomeTelegramCta` via `useTranslations("home")` under `home.telegram.*`.
