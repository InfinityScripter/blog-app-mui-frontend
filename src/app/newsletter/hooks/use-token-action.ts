import { useRef, useState, useEffect } from "react";

// ----------------------------------------------------------------------
// Shared logic for the confirm / unsubscribe status pages: read the `token`
// query param, run the given async action once, expose loading/success/error.

type TokenAction = (token: string) => Promise<unknown>;

type Status = "loading" | "success" | "error";

interface TokenActionState {
  status: Status;
  message: string;
}

export function useTokenAction(
  action: TokenAction,
  successMessage: string,
  missingTokenMessage: string,
): TokenActionState {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
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

  return { status, message };
}
