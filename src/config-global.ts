import { paths } from "src/routes/paths";

import packageJson from "../package.json";

// ----------------------------------------------------------------------

// Единственный метод авторизации в приложении — собственный JWT-бэкенд.
type AuthMethod = "jwt";

interface Config {
  site: {
    name: string;
    url: string;
    serverUrl: string;
    assetURL: string;
    basePath: string;
    version: string;
  };
  contacts: {
    email: string;
  };
  social: {
    telegram: string;
    /** Public Telegram CHANNEL the bot cross-posts to (subscribe CTA target). */
    telegramChannel: string;
    github: string;
    linkedin: string;
  };
  isStaticExport: boolean;
  auth: {
    method: AuthMethod;
    skip: boolean;
    redirectPath: string;
  };
  features: {
    /**
     * Personal-data collection (registration, OAuth sign-up, newsletter
     * subscribe). Off by default so a public deploy collects no personal data
     * (152-ФЗ). Mirrors the backend PD_COLLECTION_ENABLED flag; the code stays
     * in place either way. Sign-in of existing users is never gated.
     */
    pdCollection: boolean;
  };
}

export const CONFIG: Config = {
  site: {
    name: "Mihail Talalaev",
    url: "https://aifirst.us.com",
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
    assetURL: process.env.NEXT_PUBLIC_ASSET_URL ?? "",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
    version: packageJson.version,
  },
  contacts: {
    email: "talalaev.misha@gmail.com",
  },
  social: {
    telegram: "https://t.me/sh0ny",
    // The subscribe-CTA target. Point this at the public channel the bot
    // cross-posts to via env (NEXT_PUBLIC_TELEGRAM_CHANNEL_URL); falls back to
    // the personal handle until the channel is public.
    telegramChannel:
      process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL ?? "https://t.me/sh0ny",
    github: "https://github.com/InfinityScripter",
    linkedin: "https://www.linkedin.com/in/talalaevs/",
  },
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT ?? "false"}`),
  auth: {
    method: "jwt",
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  features: {
    pdCollection: process.env.NEXT_PUBLIC_PD_COLLECTION_ENABLED === "true",
  },
};
