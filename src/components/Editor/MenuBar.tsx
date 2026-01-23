import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface MenuBarProps {
    editor: Editor | null;
    onInsertImage: (file: File) => Promise<void>;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor, onInsertImage }) => {
    const [, setUpdate] = useState(0);

    useEffect(() => {
        if (!editor) return;

        const handleTransaction = () => {
            setUpdate(prev => prev + 1);
        };

        editor.on('transaction', handleTransaction);
        return () => {
            editor.off('transaction', handleTransaction);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    const Button = ({
        onClick,
        isActive = false,
        title,
        icon
    }: {
        onClick: () => void,
        isActive?: boolean,
        title: string,
        icon: string
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={title}
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </button>
    );

    return (
        <div className="sticky top-[80px] z-40 bg-white/80 dark:bg-[#101822]/80 backdrop-blur-md rounded-lg shadow-sm border border-[#dbe0e6] dark:border-[#2d394a] px-2 sm:px-4 py-2 mb-6 flex items-center justify-between">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
                <Button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                    icon="format_bold"
                />
                <Button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                    icon="format_italic"
                />
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                    icon="format_h1"
                />
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                    icon="format_h2"
                />
                <div className="w-px h-6 bg-[#dbe0e6] dark:bg-[#2d394a] mx-1 sm:mx-2 self-center"></div>
                <Button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                    icon="format_list_bulleted"
                />
                <Button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                    icon="format_list_numbered"
                />
                <div className="w-px h-6 bg-[#dbe0e6] dark:bg-[#2d394a] mx-1 sm:mx-2 self-center"></div>
                <Button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                    icon="format_quote"
                />
                <Button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    title="Code Block"
                    icon="code"
                />
                <Button
                    onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) onInsertImage(file);
                        };
                        input.click();
                    }}
                    title="Insert Image"
                    icon="image"
                />
            </div>
            <div className="text-[10px] font-medium text-[#617289] dark:text-[#9ba8ba] uppercase tracking-wider flex items-center gap-2 pr-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live Editor
            </div>
        </div>
    );
};
