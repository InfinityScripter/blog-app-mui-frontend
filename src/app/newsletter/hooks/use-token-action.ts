import { useRef, useState, useEffect } from "react";

// ----------------------------------------------------------------------
// Shared logic for the confirm / unsubscribe status pages: read the `token`
// query param, run the given async action once, expose loading/success/error.
// On success it counts down and redirects home so the page isn't a dead end.

type TokenAction = (token: string) => Promise<unknown>;

type Status = "loading" | "success" | "error";

interface TokenActionState {
  status: Status;
  message: string;
  redirectIn: number;
}

const REDIRECT_SECONDS = 4;

export function useTokenAction(
  action: TokenAction,
  successMessage: string,
  missingTokenMessage: string,
): TokenActionState {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const [redirectIn, setRedirectIn] = useState<number>(REDIRECT_SECONDS);
  const ran = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode's double-invoke in dev: the confirm token
    // is single-use, so a second call 404s and could clobber the success state.
    if (ran.current) return;
    ran.current = true;

    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus("error");
      setMessage(missingTokenMessage);
      return;
    }

    const run = async () => {
      try {
        await action(token);
        setStatus("success");
        setMessage(successMessage);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Что-то пошло не так",
        );
      }
    };

    run();
    // action/messages are module-level constants — run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once confirmed/unsubscribed, tick a countdown then send the reader home —
  // a blank status page is a dead end. Manual "На главную" stays available.
  useEffect(() => {
    if (status !== "success") return undefined;

    const timer = setInterval(() => {
      setRedirectIn((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.assign("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  return { status, message, redirectIn };
}
