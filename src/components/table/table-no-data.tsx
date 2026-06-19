import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { EmptyContent } from "../empty-content";

import type { TableNoDataProps } from "./types";

// ----------------------------------------------------------------------

export function TableNoData({ notFound, sx }: TableNoDataProps) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent filled sx={{ py: 10, ...sx }} />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
