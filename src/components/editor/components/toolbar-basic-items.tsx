import Stack from "@mui/material/Stack";

import { toolbarIcons } from "../const";
import { editorClasses } from "../classes";
import { ToolbarItem } from "./toolbar-item";

import type { ToolbarBasicItemsProps } from "./types";

// ----------------------------------------------------------------------

export function ToolbarBasicItems({ editor }: ToolbarBasicItemsProps) {
  return (
    <>
      {/* Text style */}
      <Stack direction="row" spacing={0.5}>
        <ToolbarItem
          aria-label="Bold"
          active={editor.isActive("bold")}
          className={editorClasses.toolbar.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<path d={toolbarIcons.bold} />}
        />
        <ToolbarItem
          aria-label="Italic"
          active={editor.isActive("italic")}
          className={editorClasses.toolbar.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<path d={toolbarIcons.italic} />}
        />
        <ToolbarItem
          aria-label="Strike"
          active={editor.isActive("strike")}
          className={editorClasses.toolbar.italic}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<path d={toolbarIcons.strike} />}
        />
      </Stack>

      {/* List */}
      <Stack direction="row" spacing={0.5}>
        <ToolbarItem
          aria-label="Bullet list"
          active={editor.isActive("bulletList")}
          className={editorClasses.toolbar.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<path d={toolbarIcons.bulletList} />}
        />
        <ToolbarItem
          aria-label="Ordered list"
          active={editor.isActive("orderedList")}
          className={editorClasses.toolbar.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<path d={toolbarIcons.orderedList} />}
        />
      </Stack>

      {/* Text align */}
      <Stack direction="row" spacing={0.5}>
        <ToolbarItem
          aria-label="Align left"
          active={editor.isActive({ textAlign: "left" })}
          className={editorClasses.toolbar.alignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<path d={toolbarIcons.alignLeft} />}
        />
        <ToolbarItem
          aria-label="Align center"
          active={editor.isActive({ textAlign: "center" })}
          className={editorClasses.toolbar.alignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<path d={toolbarIcons.alignCenter} />}
        />
        <ToolbarItem
          aria-label="Align right"
          active={editor.isActive({ textAlign: "right" })}
          className={editorClasses.toolbar.alignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<path d={toolbarIcons.alignRight} />}
        />
        <ToolbarItem
          aria-label="Align justify"
          active={editor.isActive({ textAlign: "justify" })}
          className={editorClasses.toolbar.alignJustify}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          icon={<path d={toolbarIcons.alignJustify} />}
        />
      </Stack>
    </>
  );
}
