import { CONFIG } from "src/config-global";
import { FaqsView } from "src/sections/faqs/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Вопросы и ответы - ${CONFIG.site.name}` };

export default function Page() {
  return <FaqsView />;
}
