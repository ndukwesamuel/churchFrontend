import { useState, useEffect } from "react";
import { Plus, ChevronDown, Bold, Italic, List } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

export const RichTextEditor = ({ content, onChange, variables, error }) => {
  const [showVariables, setShowVariables] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 ${
          error ? "border-red-500" : ""
        }`,
      },
    },
  });

  // Update editor content when prop changes (important for form reset)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const insertVariable = (variable) => {
    if (editor) {
      editor.commands.insertContent(variable.placeholder);
      setShowVariables(false);
      // Trigger onChange to update form state
      const updatedContent = editor.getHTML();
      onChange(updatedContent);
    }
  };

  const isActive = (format) => {
    if (!editor) return false;
    return editor.isActive(format);
  };

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] flex items-center justify-center text-gray-500">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => editor.commands.toggleBold()}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              isActive("bold") ? "bg-gray-200 text-purple-600" : "text-gray-600"
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.toggleItalic()}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              isActive("italic")
                ? "bg-gray-200 text-purple-600"
                : "text-gray-600"
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.toggleUnderline()}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              isActive("underline")
                ? "bg-gray-200 text-purple-600"
                : "text-gray-600"
            }`}
            title="Underline"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4v6a6 6 0 0 0 12 0V4" />
              <line x1="4" y1="20" x2="20" y2="20" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.commands.toggleBulletList()}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              isActive("bulletList")
                ? "bg-gray-200 text-purple-600"
                : "text-gray-600"
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Additional formatting buttons */}
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => editor.commands.undo()}
            disabled={!editor.can().undo()}
            className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            title="Undo"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => editor.commands.redo()}
            disabled={!editor.can().redo()}
            className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            title="Redo"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
            </svg>
          </button>
        </div>

        {/* Variable Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowVariables(!showVariables)}
            className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Variables
            <ChevronDown
              className={`w-3 h-3 transform transition-transform ${
                showVariables ? "rotate-180" : ""
              }`}
            />
          </button>

          {showVariables && (
            <>
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                <div className="p-2 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs text-gray-600">
                    Click to insert variable
                  </p>
                </div>
                {variables?.map((variable, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertVariable(variable)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-mono text-sm text-purple-600 font-medium">
                      {variable.placeholder}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {variable.description}
                    </div>
                  </button>
                ))}
                {(!variables || variables.length === 0) && (
                  <div className="px-3 py-4 text-center text-gray-500 text-sm">
                    No variables available
                  </div>
                )}
              </div>
              <div
                className="fixed inset-0 z-0"
                onClick={() => setShowVariables(false)}
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        className={`border rounded-lg ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        <EditorContent editor={editor} className="rich-text-editor" />
      </div>

      {/* Character/Word Count */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          {editor.storage.characterCount?.characters() || 0} characters,{" "}
          {editor.storage.characterCount?.words() || 0} words
        </div>
        {editor.isFocused && (
          <div className="text-purple-600">Currently editing</div>
        )}
      </div>

      {/* Custom styles for the editor */}
      <style jsx>{`
        .rich-text-editor .ProseMirror {
          outline: none;
          padding: 1rem;
          min-height: 200px;
        }

        .rich-text-editor .ProseMirror:focus {
          outline: none;
          border: none;
        }

        .rich-text-editor .ProseMirror ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          padding-left: 0;
        }

        .rich-text-editor .ProseMirror ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          padding-left: 0;
        }

        .rich-text-editor .ProseMirror li {
          margin: 0.25rem 0;
        }

        .rich-text-editor .ProseMirror strong {
          font-weight: bold;
        }

        .rich-text-editor .ProseMirror em {
          font-style: italic;
        }

        .rich-text-editor .ProseMirror u {
          text-decoration: underline;
        }

        .rich-text-editor .ProseMirror p {
          margin: 0.5rem 0;
        }

        .rich-text-editor .ProseMirror p:first-child {
          margin-top: 0;
        }

        .rich-text-editor .ProseMirror p:last-child {
          margin-bottom: 0;
        }

        .rich-text-editor .ProseMirror:empty::before {
          content: "Start typing your message content...";
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
      `}</style>
    </div>
  );
};
