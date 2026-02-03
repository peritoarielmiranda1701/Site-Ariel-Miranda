import React, { useEffect, useRef } from 'react';

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<any>(null);

    useEffect(() => {
        // Check if Quill is loaded globally via CDN
        // @ts-ignore
        if (window.Quill && editorRef.current && !quillInstance.current) {
            // @ts-ignore
            quillInstance.current = new window.Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'clean']
                    ],
                }
            });

            // Set initial content
            if (value) {
                // Use clipboard to safely insert HTML (better than setting innerHTML directly)
                quillInstance.current.clipboard.dangerouslyPasteHTML(value);
            }

            // Listen for changes
            quillInstance.current.on('text-change', () => {
                const html = editorRef.current?.querySelector('.ql-editor')?.innerHTML;
                if (html && html !== '<p><br></p>') {
                    onChange(html);
                } else if (html === '<p><br></p>') {
                    onChange('');
                }
            });
        }
    }, []); // Run once on mount

    return (
        <div className="bg-white text-navy-900 rounded-xl overflow-hidden border border-slate-200 hover:border-gold-500/30 transition-colors">
            {/* The container for Quill */}
            <div ref={editorRef} style={{ height: '600px', border: 'none' }} />
        </div>
    );
};

export default QuillEditor;
