// Contract types for /api/finance/* (mirrors the backend finance service).

export type FinanceFlow = "income" | "expense" | "internal" | "wash";

export interface FinanceMonth {
  ym: string;
  income: number;
  expense: number;
}

export interface FinanceCoverage {
  ym: string;
  count: number;
}

export interface FinanceMerchant {
  name: string;
  total: number;
  count: number;
}

export interface FinanceBucket {
  bucket: string;
  total: number;
  merchants: FinanceMerchant[];
}

export interface FinanceBucketOperation {
  id: string;
  opAt: string;
  merchant: string;
  description: string;
  amount: number;
  card: string;
  mcc: string;
  bankCategory: string;
  cashback: number;
}

export interface FinanceIncomeSource {
  source: string;
  total: number;
  payers: FinanceMerchant[];
}

export interface FinanceSubscription {
  name: string;
  average: number;
  monthsCount: number;
  total: number;
}

export interface FinanceSummary {
  range: { from: string | null; to: string | null };
  months: FinanceMonth[];
  coverage: FinanceCoverage[];
  totals: { income: number; expense: number; saved: number };
  incomeBySource: FinanceIncomeSource[];
  buckets: FinanceBucket[];
  subscriptions: FinanceSubscription[];
  internalVolume: number;
  washVolume: number;
}

export interface FinanceImportResult {
  inserted: number;
  duplicates: number;
  skippedFailed: number;
  badRows: number;
}
