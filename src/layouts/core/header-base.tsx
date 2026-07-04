import { HeaderSection } from "./header-section";
import { HeaderLeftArea } from "./header-left-area";
import { HeaderRightArea } from "./header-right-area";

import type { HeaderBaseProps } from "./types";

// ----------------------------------------------------------------------

export function HeaderBase({
  sx,
  data,
  slots,
  slotProps,
  onOpenNav,
  layoutQuery,

  slotsDisplay: {
    signIn = true,
    account = true,
    helpLink = false,
    settings = true,
    searchbar = true,
    menuButton = true,
    notifications = false,
  } = {},

  ...other
}: HeaderBaseProps) {
  return (
    <HeaderSection
      sx={sx}
      layoutQuery={layoutQuery}
      slots={{
        ...slots,
        leftAreaStart: slots?.leftAreaStart,
        leftArea: (
          <HeaderLeftArea
            slots={slots}
            onOpenNav={onOpenNav}
            layoutQuery={layoutQuery}
            menuButton={menuButton}
          />
        ),
        rightArea: (
          <HeaderRightArea
            data={data}
            slots={slots}
            signIn={signIn}
            account={account}
            helpLink={helpLink}
            settings={settings}
            searchbar={searchbar}
            notifications={notifications}
          />
        ),
      }}
      slotProps={slotProps}
      {...other}
    />
  );
}
