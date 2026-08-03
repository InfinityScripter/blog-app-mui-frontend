import { useRef, useState, useCallback } from "react";
import { importFinanceCsv } from "src/actions/finance";
import { decodeStatementFile } from "src/sections/finance/utils";

export interface ImportFileOutcome {
  filename: string;
  inserted: number;
  duplicates: number;
  skippedFailed: number;
  badRows: number;
  error?: string;
}

export function useFinanceImport(onImported: () => void) {
  const busyRef = useRef(false);
  const [importing, setImporting] = useState(false);
  const [outcomes, setOutcomes] = useState<ImportFileOutcome[]>([]);

  const importFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0 || busyRef.current) {
        return;
      }
      busyRef.current = true;
      setImporting(true);
      const results: ImportFileOutcome[] = [];
      try {
        await files.reduce(async (previous, file) => {
          await previous;
          try {
            const csv = await decodeStatementFile(file);
            const result = await importFinanceCsv(csv, file.name);
            results.push({ filename: file.name, ...result });
          } catch (error) {
            results.push({
              filename: file.name,
              inserted: 0,
              duplicates: 0,
              skippedFailed: 0,
              badRows: 0,
              error:
                error instanceof Error
                  ? error.message
                  : "Не удалось импортировать файл",
            });
          }
        }, Promise.resolve());
        setOutcomes(results);
        onImported();
      } finally {
        busyRef.current = false;
        setImporting(false);
      }
    },
    [onImported],
  );

  return { importing, outcomes, importFiles };
}
