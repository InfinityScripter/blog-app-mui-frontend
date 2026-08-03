import type { FinanceSubscription } from "src/types/finance";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { fRub } from "src/sections/finance/utils";

export function FinanceSubscriptionsCard({
  subscriptions,
}: {
  subscriptions: FinanceSubscription[];
}) {
  return (
    <Card>
      <CardHeader
        title="Регулярные платежи"
        subheader="Одинаковые суммы, идущие из месяца в месяц, — кандидаты на ревизию"
      />
      <Stack spacing={1} sx={{ p: 3, pt: 2 }}>
        {subscriptions.length === 0 ? (
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            Регулярные списания не найдены.
          </Typography>
        ) : null}
        {subscriptions.map((subscription) => (
          <Stack
            key={subscription.name}
            direction="row"
            spacing={2}
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              noWrap
              sx={{ color: "text.secondary", minWidth: 0 }}
            >
              {subscription.name}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
              {fRub(subscription.average)}/мес · {subscription.monthsCount} мес
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
