import { useTranslations } from "next-intl";

// ----------------------------------------------------------------------

const REPEATS = 6;

export function Ribbons() {
  const t = useTranslations("home.ribbons");

  const track = (key: "a" | "b") => {
    const words: string[] = t.raw(key);
    return Array.from({ length: REPEATS }, () => words)
      .flat()
      .map((word, index) => <span key={index}>{word}</span>);
  };

  return (
    <div className="ls-ribbons" aria-hidden>
      <div className="ls-ribbon ls-ribbon--b">
        <div className="ls-track">{track("b")}</div>
      </div>
      <div className="ls-ribbon ls-ribbon--a">
        <div className="ls-track">{track("a")}</div>
      </div>
    </div>
  );
}
