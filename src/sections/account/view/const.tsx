import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export const ACCOUNT_TABS = [
  {
    value: "general",
    label: "Общие",
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: "security",
    label: "Безопасность",
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
] as const;
