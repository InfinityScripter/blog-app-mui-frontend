import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function SplitSignUpTerms() {
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
      {"By signing up, I agree to "}
      <Link underline="always" color="text.primary">
        Terms of service
      </Link>
      {" and "}
      <Link underline="always" color="text.primary">
        Privacy policy
      </Link>
      .
    </Typography>
  );
}
