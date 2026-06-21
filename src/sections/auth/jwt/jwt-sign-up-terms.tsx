import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function JwtSignUpTerms() {
  return (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: "center",
        typography: "caption",
        color: "text.secondary",
      }}
    >
      {"Регистрируясь, я соглашаюсь с "}
      <Link underline="always" color="text.primary">
        Условиями использования
      </Link>
      {" и "}
      <Link underline="always" color="text.primary">
        Политикой конфиденциальности
      </Link>
      .
    </Typography>
  );
}
