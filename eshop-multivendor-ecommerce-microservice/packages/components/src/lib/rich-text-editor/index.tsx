import { useEffect, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const [editorValue, setEditorValue] = useState(value || ''); // Single state
  const quillRef = useRef(false);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = true; // Mark as mounted

      // Fix: Ensure only one toolbar is present
      setTimeout(() => {
        document.querySelectorAll('.ql-toolbar').forEach((toolbar, index) => {
          if (index > 0) {
            toolbar.remove(); // Remove extra toolbars
          }
        });
      }, 100); // Short delay ensures Quill is fully initialized
    }
  }, []);

  return (
    <div className="relative">
      {/* No duplicate Quill instances */}
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={{
          toolbar: [
            [{ font: [] }], // Font picker
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
            [{ size: ['small', false, 'large', 'huge'] }], // Font sizes
            ['bold', 'italic', 'underline', 'strike'], // Basic text styling
            [{ color: [] }, { background: [] }], // Font & Background colors
            [{ script: 'sub' }, { script: 'super' }], // Subscript / Superscript
            [{ list: 'ordered' }, { list: 'bullet' }], // Lists
            [{ indent: '-1' }, { indent: '+1' }], // Indentation
            [{ align: [] }], // Text alignment
            ['blockquote', 'code-block'], // Blockquote & Code Block
            ['link', 'image', 'video'], // Insert Link, Image, Video
            ['clean'], // Remove formatting
          ],
        }}
        placeholder="Write a detailed product description here..."
        className="bg-transparent border border-gray-700 text-white rounded-md"
        style={{ minHeight: '250px' }}
      />

      <style>
        {`
    .ql-toolbar {
        background: transparent; Dark toolbar */
        border-color: #444;
    }
    .ql-container {
        background: transparent !important;
        border-color: #444;
        color: white; /* Text color inside editor */
    }
    .ql-picker {
        color: white!important;
    }
    .ql-editor {
        min-height: 200px; /* Adjust editor height */
    }
    .ql-snow {
        border-color: #444!important;
    }
    .ql-editor.ql-blank:: before {
        color: #aaa !important; /* Placeholder color */
    }
    .ql-picker-options {
        background: #333 !important; /* Fix dropdown color */
        color: white !important;
    }
    .ql-picker-item {
        color: white !important;
    }
    .ql-stroke {
        stroke: white !important;
    }
    `}
      </style>
    </div>
  );
};

export { RichTextEditor };
