import ru from "messages/ru.json";
import { it, expect, describe } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { renderToStaticMarkup } from "react-dom/server";

import { COMPARABLE_MODELS } from "../data";
import { CompareCard } from "../compare-card";
import { CompareTableRow } from "../compare-table-row";
import { ComparePinColumn } from "../compare-pin-column";

const model = COMPARABLE_MODELS[0];

function render(node: React.ReactNode) {
  return renderToStaticMarkup(
    <NextIntlClientProvider locale="ru" messages={ru} timeZone="UTC">
      {node}
    </NextIntlClientProvider>,
  );
}

describe("llm-compare icon buttons", () => {
  it("table row pin button names the action and the model", () => {
    const html = render(
      <table>
        <tbody>
          <CompareTableRow
            model={model}
            bests={{}}
            pinned={false}
            pinDisabled={false}
            onTogglePin={() => undefined}
          />
        </tbody>
      </table>,
    );

    expect(html).toContain(`aria-label="Закрепить ${model.name}"`);
  });

  it("card pin button names the action and the model", () => {
    const html = render(
      <CompareCard
        model={model}
        pinned
        pinDisabled={false}
        onTogglePin={() => undefined}
      />,
    );

    expect(html).toContain(`aria-label="Убрать из сравнения: ${model.name}"`);
  });

  it("pinned column remove button names the model", () => {
    const html = render(
      <ComparePinColumn model={model} onRemove={() => undefined} />,
    );

    expect(html).toContain(`aria-label="Убрать из сравнения: ${model.name}"`);
  });
});
