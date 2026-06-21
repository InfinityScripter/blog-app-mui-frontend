import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

export function reader(data: string) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        "& p": { typography: "body2", m: 0 },
        "& a": { color: "inherit", textDecoration: "none" },
        "& strong": { typography: "subtitle2" },
      }}
    />
  );
}
