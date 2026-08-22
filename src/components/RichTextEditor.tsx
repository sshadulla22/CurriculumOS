import { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Heading1,
  Heading2,
  Heading3,
  RemoveFormatting,
  Palette,
  Highlighter,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write content here...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value prop to editor innerHTML
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      isUpdatingRef.current = false;
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      isUpdatingRef.current = false;
    }
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden text-neutral-900 dark:text-neutral-100 shadow-sm transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-2 py-1.5 text-neutral-700 dark:text-neutral-300">
        {/* Headings */}
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h1>')}
          title="Heading 1"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Heading1 size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h2>')}
          title="Heading 2"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h3>')}
          title="Heading 3"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Heading3 size={15} />
        </button>

        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => exec('bold')}
          title="Bold"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          title="Italic"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          title="Underline"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Underline size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          title="Strikethrough"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Strikethrough size={15} />
        </button>

        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800 mx-1" />

        {/* Lists & Blocks */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<blockquote>')}
          title="Quote"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Quote size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<pre>')}
          title="Code Block"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Code size={15} />
        </button>

        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800 mx-1" />

        {/* Color Pickers */}
        <label title="Text Color" className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors">
          <Palette size={15} />
          <input
            type="color"
            onChange={(e) => exec('foreColor', e.target.value)}
            className="h-3.5 w-3.5 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>
        <label title="Highlight Color" className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors">
          <Highlighter size={15} />
          <input
            type="color"
            defaultValue="#fef08a"
            onChange={(e) => exec('hiliteColor', e.target.value)}
            className="h-3.5 w-3.5 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>

        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800 mx-1" />

        {/* Link & Clear */}
        <button
          type="button"
          onClick={addLink}
          title="Insert Link"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Link size={15} />
        </button>
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          title="Clear Formatting"
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <RemoveFormatting size={15} />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[160px] p-3 text-[13.5px] leading-relaxed outline-none text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 empty:before:pointer-events-none empty:before:text-neutral-400 dark:empty:before:text-neutral-500 empty:before:content-[attr(data-placeholder)] [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:my-1 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 dark:[&_blockquote]:border-neutral-700 [&_blockquote]:pl-3 [&_blockquote]:italic [&_pre]:bg-neutral-950 [&_pre]:text-neutral-100 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:font-mono"
      />
    </div>
  );
}
