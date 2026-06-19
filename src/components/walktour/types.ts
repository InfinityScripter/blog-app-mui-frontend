import type { ButtonProps } from "@mui/material/Button";
import type { Theme, SxProps } from "@mui/material/styles";
import type { IconButtonProps } from "@mui/material/IconButton";
import type {
  Step,
  Props,
  Locale,
  StepMerged,
  StoreHelpers,
  CallBackProps,
  TooltipRenderProps,
} from "react-joyride";

// ----------------------------------------------------------------------

export type WalktourSlotProps = {
  root?: SxProps<Theme>;
  title?: SxProps<Theme>;
  content?: SxProps<Theme>;
  progress?: SxProps<Theme>;
  skipBtn?: ButtonProps;
  backBtn?: ButtonProps;
  nextBtn?: ButtonProps;
  closeBtn?: IconButtonProps;
};

export type WalktourStep = Step & {
  slotProps?: WalktourSlotProps;
};

export type WalktourTooltipProps = Omit<TooltipRenderProps, "step"> & {
  step: StepMerged & {
    slotProps?: WalktourSlotProps;
  };
};

export type WalktourProps = Partial<Props>;

export type UseWalktourProps = {
  steps: WalktourStep[];
  defaultRun?: boolean;
};

export type UseWalktourReturn = {
  run: boolean;
  steps: WalktourStep[];
  setRun: (run: boolean) => void;
  onCallback: (data: CallBackProps) => void;
  setHelpers: (storeHelpers: StoreHelpers) => void;
};

export type WalktourProgressBarProps = {
  onGoStep: (step: number) => void;
  totalSteps: number;
  currentStep: number;
};

export type { Locale };
