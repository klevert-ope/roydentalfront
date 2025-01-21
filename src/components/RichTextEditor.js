"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Eraser,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const RichTextEditor = ({ name, defaultValue = "", setValue }) => {
  // Create the editor instance with extensions and configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: true,
        orderedList: true,
        bold: true,
        italic: true,
        listItem: true,
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "prose text-wrap focus:outline-none" +
          " prose-headings:text-[var(--foreground)] prose-p:text-white" +
          " prose-a:text-white prose-strong:text-white",
      },
    },
    content: defaultValue,
    onUpdate: ({ editor }) => {
      updateContent(editor);
    },
  });

  // Debounce function to limit the frequency of setValue calls
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const updateContent = useMemo(
    () =>
      debounce((editor) => {
        setValue(name, editor.getHTML());
      }, 300),
    [name, setValue],
  );

  // Effect to set content when defaultValue changes
  useEffect(() => {
    if (editor && defaultValue.trim() !== editor.getHTML().trim()) {
      editor.commands.setContent(defaultValue, false);
    }
  }, [editor, defaultValue]);

  // Cleanup the editor on unmounting
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Memoized function to handle editor actions (bold, italic, etc.)
  const handleEditorAction = useCallback(
    (action, options = {}) => {
      editor?.chain().focus()[action](options).run();
    },
    [editor],
  );

  // Memoize toolbar button state based on editor activity
  const toolbarButtons = useMemo(
    () => [
      { action: "toggleBold", icon: Bold, active: editor?.isActive("bold") },
      {
        action: "toggleItalic",
        icon: Italic,
        active: editor?.isActive("italic"),
      },
      {
        action: "toggleUnderline",
        icon: UnderlineIcon,
        active: editor?.isActive("underline"),
      },
      {
        action: "toggleBulletList",
        icon: List,
        active: editor?.isActive("bulletList"),
      },
      {
        action: "toggleOrderedList",
        icon: ListOrdered,
        active: editor?.isActive("orderedList"),
      },
    ],
    [editor],
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-md max-w-[625px]">
        {/* Text Styles */}
        <div className="flex gap-2">
          {toolbarButtons.map(({ action, icon: Icon, active }) => (
            <Button
              key={action}
              variant="icon"
              type="button"
              className={`p-2 rounded ${
                active ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => handleEditorAction(action)}
            >
              <Icon />
            </Button>
          ))}
        </div>

        {/* Headings */}
        <div className="flex gap-2">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              variant="ghost"
              type="button"
              className={`p-2 rounded ${
                editor?.isActive("heading", { level })
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleEditorAction("toggleHeading", { level })}
            >
              H{level}
            </Button>
          ))}
        </div>

        {/* Clear Content */}
        <div>
          <Button
            variant="icon"
            type="button"
            onClick={() => handleEditorAction("clearContent")}
          >
            <Eraser />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="mt-4">
        <EditorContent
          editor={editor}
          className="border border-gray-200 rounded-md min-h-[200px]"
        />
      </div>
    </div>
  );
};

export default React.memo(RichTextEditor);
