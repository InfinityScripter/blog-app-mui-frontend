"use client";

import type { AuditLogsParams } from "src/actions/admin";

import { useMemo, useState } from "react";
import { useAuthContext } from "src/auth/hooks";
import { useGetAuditLogs } from "src/actions/admin";
import { useSetState } from "src/hooks/use-set-state";
import {
  Box,
  Card,
  Chip,
  Stack,
  Table,
  Select,
  MenuItem,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  InputLabel,
  Typography,
  FormControl,
  TableContainer,
  TablePagination,
  CircularProgress,
} from "@mui/material";

import {
  formatAuditActor,
  formatAuditTarget,
  formatAuditMetadata,
} from "./utils";
import {
  AUDIT_TABLE_HEAD,
  AUDIT_ACTION_OPTIONS,
  AUDIT_TARGET_TYPE_OPTIONS,
  AUDIT_DEFAULT_ROWS_PER_PAGE,
  AUDIT_ROWS_PER_PAGE_OPTIONS,
} from "./const";

import type { AuditLogsFilters } from "./types";

// ----------------------------------------------------------------------

export function AdminAuditLogsView() {
  const { authenticated } = useAuthContext();

  const filters = useSetState<AuditLogsFilters>({
    action: "",
    targetType: "",
    actorId: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(AUDIT_DEFAULT_ROWS_PER_PAGE);

  // Стабильный SWR-ключ: убираем пустые фильтры из params.
  const params = useMemo<AuditLogsParams>(() => {
    const next: AuditLogsParams = {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    };
    if (filters.state.action) next.action = filters.state.action;
    if (filters.state.targetType) next.targetType = filters.state.targetType;
    if (filters.state.actorId) next.actorId = filters.state.actorId.trim();
    return next;
  }, [filters.state, page, rowsPerPage]);

  const { auditLogs, auditLogsTotal, auditLogsLoading } = useGetAuditLogs(
    params,
    authenticated,
  );

  // Смена любого фильтра → сброс страницы в 0.
  const handleFilterChange = (field: keyof AuditLogsFilters, value: string) => {
    filters.setField(field, value);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Журнал аудита
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Действие</InputLabel>
          <Select
            label="Действие"
            value={filters.state.action}
            onChange={(e) => handleFilterChange("action", e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {AUDIT_ACTION_OPTIONS.map((a) => (
              <MenuItem key={a} value={a}>
                {a}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Тип target</InputLabel>
          <Select
            label="Тип target"
            value={filters.state.targetType}
            onChange={(e) => handleFilterChange("targetType", e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {AUDIT_TARGET_TYPE_OPTIONS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Актор (ID)"
          value={filters.state.actorId}
          onChange={(e) => handleFilterChange("actorId", e.target.value)}
          sx={{ minWidth: 240 }}
        />
      </Stack>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {AUDIT_TABLE_HEAD.map((head) => (
                  <TableCell key={head}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogsLoading && (
                <TableRow>
                  <TableCell colSpan={AUDIT_TABLE_HEAD.length} align="center">
                    <CircularProgress size={24} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              )}

              {!auditLogsLoading && auditLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={AUDIT_TABLE_HEAD.length} align="center">
                    <Typography variant="body2" sx={{ my: 3 }}>
                      Нет записей
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!auditLogsLoading &&
                auditLogs.map((log) => {
                  const meta = formatAuditMetadata(log.metadata);
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString("ru-RU")}
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Chip
                            label={log.action}
                            size="small"
                            variant="soft"
                          />
                          {meta && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ wordBreak: "break-all" }}
                            >
                              {meta}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>{formatAuditActor(log)}</TableCell>
                      <TableCell>{formatAuditTarget(log)}</TableCell>
                      <TableCell>{log.ip ?? "—"}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={auditLogsTotal}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={AUDIT_ROWS_PER_PAGE_OPTIONS}
        />
      </Card>
    </Box>
  );
}
