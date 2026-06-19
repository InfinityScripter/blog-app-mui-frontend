import type { SystemStyleObject } from "@mui/system";
import type { StackProps } from "@mui/material/Stack";
import type { Theme, SxProps } from "@mui/material/styles";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { fileThumbnailClasses } from "./classes";
import { fileData, fileThumb, fileFormat } from "./utils";
import { RemoveButton, DownloadButton } from "./action-buttons";

// ----------------------------------------------------------------------

export interface FileThumbnailSlotProps {
  img?: SystemStyleObject<Theme>;
  icon?: SystemStyleObject<Theme>;
  removeBtn?: SxProps<Theme>;
  downloadBtn?: SxProps<Theme>;
}

export interface FileThumbnailProps extends Omit<StackProps, "onClick"> {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onRemove?: () => void;
  onDownload?: () => void;
  slotProps?: FileThumbnailSlotProps;
}

export const FileThumbnail = forwardRef<HTMLDivElement, FileThumbnailProps>(
  (
    { sx, file, tooltip, onRemove, imageView, slotProps, onDownload, ...other },
    ref,
  ) => {
    const previewUrl =
      typeof file === "string" ? file : URL.createObjectURL(file);

    const { name, path } = fileData(file);

    const format = fileFormat(path || previewUrl);

    const renderImg = (
      <Box
        component="img"
        src={previewUrl}
        className={fileThumbnailClasses.img}
        sx={{
          width: 1,
          height: 1,
          objectFit: "cover",
          borderRadius: "inherit",
          ...slotProps?.img,
        }}
      />
    );

    const renderIcon = (
      <Box
        component="img"
        src={fileThumb(format)}
        className={fileThumbnailClasses.icon}
        sx={{ width: 1, height: 1, ...slotProps?.icon }}
      />
    );

    const renderContent = (
      <Stack
        ref={ref}
        component="span"
        className={fileThumbnailClasses.root}
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: 1.25,
          alignItems: "center",
          position: "relative",
          display: "inline-flex",
          justifyContent: "center",
          ...sx,
        }}
        {...other}
      >
        {format === "image" && imageView ? renderImg : renderIcon}

        {onRemove && (
          <RemoveButton
            onClick={onRemove}
            className={fileThumbnailClasses.removeBtn}
            sx={slotProps?.removeBtn}
          />
        )}

        {onDownload && (
          <DownloadButton
            onClick={onDownload}
            className={fileThumbnailClasses.downloadBtn}
            sx={slotProps?.downloadBtn}
          />
        )}
      </Stack>
    );

    if (tooltip) {
      return (
        <Tooltip
          arrow
          title={name}
          slotProps={{
            popper: {
              modifiers: [{ name: "offset", options: { offset: [0, -12] } }],
            },
          }}
        >
          {renderContent}
        </Tooltip>
      );
    }

    return renderContent;
  },
);

FileThumbnail.displayName = "FileThumbnail";
