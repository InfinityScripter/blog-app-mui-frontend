import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

interface ReleaseChangesProps {
  changes: string[];
}

/** Bulleted list of what changed. Renders nothing when the list is empty. */
export function ReleaseChanges({ changes }: ReleaseChangesProps) {
  if (changes.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">Что нового</Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 3, m: 0 }}>
        {changes.map((change, index) => (
          // Changes are free-text lines with no stable id; index is stable
          // within a single render of an immutable list.
          <Typography key={index} component="li" variant="body1">
            {change}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
