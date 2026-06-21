import type { Theme, SxProps } from "@mui/material/styles";
import type { TablePaginationProps } from "@mui/material/TablePagination";
import type { Dispatch, ReactNode, ChangeEvent, SetStateAction } from "react";

// ----------------------------------------------------------------------

export type Order = "asc" | "desc";

export interface TableHeadLabel {
  id: string;
  label?: ReactNode;
  align?: "left" | "center" | "right" | "inherit" | "justify";
  width?: number | string;
  minWidth?: number | string;
}

export interface UseTableProps {
  defaultDense?: boolean;
  defaultCurrentPage?: number;
  defaultOrderBy?: string;
  defaultRowsPerPage?: number;
  defaultOrder?: Order;
  defaultSelected?: string[];
}

export interface TableProps {
  dense: boolean;
  page: number;
  orderBy: string;
  rowsPerPage: number;
  order: Order;
  //
  selected: string[];
  onSelectRow: (inputValue: string) => void;
  onSelectAllRows: (checked: boolean, inputValue: string[]) => void;
  //
  onSort: (id: string) => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeDense: (event: ChangeEvent<HTMLInputElement>) => void;
  onResetPage: () => void;
  onChangeRowsPerPage: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onUpdatePageDeleteRow: (totalRowsInPage: number) => void;
  onUpdatePageDeleteRows: (props: {
    totalRowsInPage: number;
    totalRowsFiltered: number;
  }) => void;
  //
  setPage: Dispatch<SetStateAction<number>>;
  setDense: Dispatch<SetStateAction<boolean>>;
  setOrder: Dispatch<SetStateAction<Order>>;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setSelected: Dispatch<SetStateAction<string[]>>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
}

export interface TableEmptyRowsProps {
  emptyRows: number;
  height?: number;
}

export interface TableHeadCustomProps {
  sx?: SxProps<Theme>;
  order?: Order;
  orderBy?: string;
  rowCount?: number;
  numSelected?: number;
  onSort?: (id: string) => void;
  headLabel: TableHeadLabel[];
  onSelectAllRows?: (checked: boolean) => void;
}

export interface TableNoDataProps {
  notFound: boolean;
  sx?: SxProps<Theme>;
}

export interface TableSelectedActionProps {
  dense?: boolean;
  rowCount: number;
  numSelected: number;
  sx?: SxProps<Theme>;
  action?: ReactNode;
  onSelectAllRows: (checked: boolean) => void;
}

export interface TablePaginationCustomProps
  extends Omit<TablePaginationProps, "component"> {
  sx?: SxProps<Theme>;
  dense?: boolean;
  onChangeDense?: (event: ChangeEvent<HTMLInputElement>) => void;
}
