import type { LlmStats } from "src/sections/admin/llm-stats/types";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import CardHeader from "@mui/material/CardHeader";
import TableContainer from "@mui/material/TableContainer";
import { formatUsd, formatTokens } from "src/sections/admin/llm-stats/utils";

export function ModelTable({ stats }: { stats: LlmStats }) {
  return (
    <Card>
      <CardHeader title="Модели" />
      <TableContainer sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Модель</TableCell>
              <TableCell align="right">Запросов</TableCell>
              <TableCell align="right">Вход</TableCell>
              <TableCell align="right">Выход</TableCell>
              <TableCell align="right">Кэш</TableCell>
              <TableCell align="right">Оценка $</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.byModel.map((m) => (
              <TableRow key={m.model}>
                <TableCell>{m.model}</TableCell>
                <TableCell align="right">{m.requests}</TableCell>
                <TableCell align="right">{formatTokens(m.tokensIn)}</TableCell>
                <TableCell align="right">{formatTokens(m.tokensOut)}</TableCell>
                <TableCell align="right">
                  {formatTokens(m.cacheRead + m.cacheWrite)}
                </TableCell>
                <TableCell align="right">
                  {m.costUsd == null ? "—" : formatUsd(m.costUsd)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
