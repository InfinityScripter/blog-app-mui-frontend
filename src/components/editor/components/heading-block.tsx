import type { MouseEvent } from "react";
import type { Editor } from "@tiptap/react";

import { useState } from "react";
import Menu from "@mui/material/Menu";
import { varAlpha } from "src/theme/styles";
import { listClasses } from "@mui/material/List";
import ButtonBase, { buttonBaseClasses } from "@mui/material/ButtonBase";

import { Iconify } from "../../iconify";
import { ToolbarItem } from "./toolbar-item";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_OPTIONS: { label: string; level: HeadingLevel }[] = [
  { label: "Heading 1", level: 1 },
  { label: "Heading 2", level: 2 },
  { label: "Heading 3", level: 3 },
  { label: "Heading 4", level: 4 },
  { label: "Heading 5", level: 5 },
  { label: "Heading 6", level: 6 },
];

// ----------------------------------------------------------------------

interface HeadingBlockProps {
  editor: Editor;
}

export function HeadingBlock({ editor }: HeadingBlockProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <ButtonBase
        id="heading-menu-button"
        aria-label="Heading menu button"
        aria-controls={anchorEl ? "heading-menu-button" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={handleClick}
        sx={{
          px: 1,
          width: 120,
          height: 32,
          borderRadius: 0.75,
          typography: "body2",
          justifyContent: "space-between",
          border: (theme) =>
            `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.2)}`,
        }}
      >
        {(editor.isActive("heading", { level: 1 }) && "Heading 1") ||
          (editor.isActive("heading", { level: 2 }) && "Heading 2") ||
          (editor.isActive("heading", { level: 3 }) && "Heading 3") ||
          (editor.isActive("heading", { level: 4 }) && "Heading 4") ||
          (editor.isActive("heading", { level: 5 }) && "Heading 5") ||
          (editor.isActive("heading", { level: 6 }) && "Heading 6") ||
          "Paragraph"}

        <Iconify
          width={16}
          icon={
            anchorEl
              ? "eva:arrow-ios-upward-fill"
              : "eva:arrow-ios-downward-fill"
          }
        />
      </ButtonBase>

      <Menu
        id="heading-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "heading-button" }}
        slotProps={{
          paper: {
            sx: {
              width: 120,
              [`& .${listClasses.root}`]: {
                gap: 0.5,
                display: "flex",
                flexDirection: "column",
              },
              [`& .${buttonBaseClasses.root}`]: {
                px: 1,
                width: 1,
                height: 34,
                borderRadius: 0.75,
                justifyContent: "flex-start",
                "&:hover": { backgroundColor: "action.hover" },
              },
            },
          },
        }}
      >
        <ToolbarItem
          component="li"
          label="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => {
            handleClose();
            editor.chain().focus().setParagraph().run();
          }}
        />

        {HEADING_OPTIONS.map(({ label, level }, index) => (
          <ToolbarItem
            aria-label={label}
            component="li"
            key={label}
            label={label}
            active={editor.isActive("heading", { level })}
            onClick={() => {
              handleClose();
              editor.chain().focus().toggleHeading({ level }).run();
            }}
            sx={{
              fontSize: 18 - index,
              fontWeight: "fontWeightBold",
            }}
          />
        ))}
      </Menu>
    </>
  );
}
