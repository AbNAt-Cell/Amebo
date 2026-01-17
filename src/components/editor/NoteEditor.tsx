'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Heading1,
    Heading2,
    Highlighter,
    Link as LinkIcon,
    Undo,
    Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
}

export function NoteEditor({
    content = '',
    onChange,
    placeholder = 'Start writing your note...',
    editable = true,
}: NoteEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-8 py-6',
            },
        },
    });

    if (!editor) {
        return (
            <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-[400px]" />
        );
    }

    return (
        <div className="bg-white dark:bg-[#181b21] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-800 flex-wrap">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive('code')}
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    active={editor.isActive('highlight')}
                >
                    <Highlighter className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    active={editor.isActive('taskList')}
                >
                    <CheckSquare className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => {
                        const url = window.prompt('Enter URL');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    active={editor.isActive('link')}
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
            </div>



            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}

function ToolbarButton({
    children,
    onClick,
    active,
    disabled,
}: {
    children: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'p-2 rounded-lg transition-colors',
                active
                    ? 'bg-[#EEE2F4] dark:bg-[#8D1CDF]/20 text-[#8D1CDF]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                disabled && 'opacity-50 cursor-not-allowed'
            )}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />;
}

function BubbleButton({
    children,
    onClick,
    active,
}: {
    children: React.ReactNode;
    onClick: () => void;
    active?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'p-1.5 rounded transition-colors',
                active
                    ? 'bg-[#8D1CDF] text-white'
                    : 'text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200'
            )}
        >
            {children}
        </button>
    );
}
