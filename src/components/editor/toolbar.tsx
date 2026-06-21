import type { Editor } from "@tiptap/react";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { varAlpha } from "src/theme/styles";

import { toolbarIcons } from "./const";
import { editorClasses } from "./classes";
import { LinkBlock } from "./components/link-block";
import { ImageBlock } from "./components/image-block";
import { ToolbarItem } from "./components/toolbar-item";
import { HeadingBlock } from "./components/heading-block";
import { ToolbarBasicItems } from "./components/toolbar-basic-items";

// ----------------------------------------------------------------------

interface ToolbarProps {
  editor: Editor | null;
  fullItem?: boolean;
  fullScreen: boolean;
  onToggleFullScreen: () => void;
}

// ----------------------------------------------------------------------

export function Toolbar({
  editor,
  fullItem,
  fullScreen,
  onToggleFullScreen,
}: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <Stack
      spacing={1}
      direction="row"
      flexWrap="wrap"
      alignItems="center"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ height: 16, my: "auto" }}
        />
      }
      className={editorClasses.toolbar.root}
      sx={{
        p: 1.25,
        bgcolor: "background.paper",
        borderTopRightRadius: "inherit",
        borderTopLeftRadius: "inherit",
        borderBottom: (theme) =>
          `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.2)}`,
      }}
    >
      <HeadingBlock editor={editor} />

      <ToolbarBasicItems editor={editor} />

      {/* Code - Code block */}
      {fullItem && (
        <Stack direction="row" spacing={0.5}>
          <ToolbarItem
            aria-label="Align justify"
            active={editor.isActive("code")}
            className={editorClasses.toolbar.code}
            onClick={() => editor.chain().focus().toggleCode().run()}
            icon={<path d={toolbarIcons.code} />}
          />
          <ToolbarItem
            aria-label="Align justify"
            active={editor.isActive("codeBlock")}
            className={editorClasses.toolbar.codeBlock}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={<path d={toolbarIcons.codeBlock} />}
          />
        </Stack>
      )}

      {/* Blockquote - Hr line */}
      {fullItem && (
        <Stack direction="row" spacing={0.5}>
          <ToolbarItem
            aria-label="Blockquote"
            active={editor.isActive("blockquote")}
            className={editorClasses.toolbar.blockquote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={<path d={toolbarIcons.blockquote} />}
          />
          <ToolbarItem
            aria-label="Horizontal"
            className={editorClasses.toolbar.hr}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={<path d={toolbarIcons.hr} />}
          />
        </Stack>
      )}

      {/* Link - Image */}
      <Stack direction="row" spacing={0.5}>
        <LinkBlock editor={editor} />
        <ImageBlock editor={editor} />
      </Stack>

      {/* HardBreak - Clear */}
      <Stack direction="row" spacing={0.5}>
        <ToolbarItem
          aria-label="HardBreak"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={editorClasses.toolbar.hardbreak}
          icon={<path d={toolbarIcons.hardbreak} />}
        />
        <ToolbarItem
          aria-label="Clear"
          className={editorClasses.toolbar.clear}
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          icon={<path d={toolbarIcons.clear} />}
        />
      </Stack>

      {/* Undo - Redo */}
      {fullItem && (
        <Stack direction="row" spacing={0.5}>
          <ToolbarItem
            aria-label="Undo"
            className={editorClasses.toolbar.undo}
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
            icon={<path d={toolbarIcons.undo} />}
          />
          <ToolbarItem
            aria-label="Redo"
            className={editorClasses.toolbar.redo}
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
            icon={<path d={toolbarIcons.redo} />}
          />
        </Stack>
      )}

      <Stack direction="row" spacing={0.5}>
        <ToolbarItem
          aria-label="Fullscreen"
          className={editorClasses.toolbar.fullscreen}
          onClick={onToggleFullScreen}
          icon={
            fullScreen ? (
              <path d={toolbarIcons.fullscreenOn} />
            ) : (
              <path d={toolbarIcons.fullscreenOff} />
            )
          }
        />
      </Stack>
    </Stack>
  );
}
