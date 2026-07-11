import { CONFIG } from "src/config-global";

// The subscribe CTA points at the public Telegram CHANNEL (set via
// NEXT_PUBLIC_TELEGRAM_CHANNEL_URL); falls back to the personal handle until the
// channel is public.
export const TELEGRAM_URL = CONFIG.social.telegramChannel;

// Copy (label / title / text / button) is resolved per-locale in
// `HomeTelegramCta` via `useTranslations("home")` under `home.telegram.*`.
