import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBlogById, createBlog, updateBlogAsync, clearCurrentBlog } from '../../features/blogSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
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


    return (
        <div className="sticky top-[80px] z-40 bg-white/80 dark:bg-[#101822]/80 backdrop-blur-md rounded-lg shadow-sm border border-[#dbe0e6] dark:border-[#2d394a] px-2 sm:px-4 py-2 mb-6 flex items-center justify-between">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('bold') ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Bold"
                >
                    <span className="material-symbols-outlined text-[20px]">format_bold</span>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('italic') ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Italic"
                >
                    <span className="material-symbols-outlined text-[20px]">format_italic</span>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Heading 1"
                >
                    <span className="material-symbols-outlined text-[20px]">format_h1</span>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Heading 2"
                >
                    <span className="material-symbols-outlined text-[20px]">format_h2</span>
                </button>
                <div className="w-px h-6 bg-[#dbe0e6] dark:bg-[#2d394a] mx-1 sm:mx-2 self-center"></div>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Bullet List"
                >
                    <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Ordered List"
                >
                    <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                </button>
                <div className="w-px h-6 bg-[#dbe0e6] dark:bg-[#2d394a] mx-1 sm:mx-2 self-center"></div>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Quote"
                >
                    <span className="material-symbols-outlined text-[20px]">format_quote</span>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded transition-colors ${editor.isActive('codeBlock') ? 'bg-primary text-white shadow-sm' : 'text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Code Block"
                >
                    <span className="material-symbols-outlined text-[20px]">code</span>
                </button>
            </div>
            <div className="text-[10px] font-medium text-[#617289] dark:text-[#9ba8ba] uppercase tracking-wider flex items-center gap-2 pr-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live Editor
            </div>
        </div>
    );
};

const BlogForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { currentBlog, loading } = useSelector((state: RootState) => state.blogs);
    const username = user?.email?.split('@')[0] || 'author';

    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [hasLoadedContent, setHasLoadedContent] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-2',
            },
        },
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchBlogById(id));
        } else {
            dispatch(clearCurrentBlog());
            setTitle('');
            setImageUrl('');
            setSlug('');
            editor?.commands.setContent('');
            setHasLoadedContent(true);
        }
    }, [id, dispatch, editor]);

    useEffect(() => {
        if (id && currentBlog && editor && !hasLoadedContent) {
            setTitle(currentBlog.title || '');
            setImageUrl(currentBlog.image_url || '');
            setSlug(currentBlog.slug || '');
            if (currentBlog.content) {
                editor.commands.setContent(currentBlog.content);
            }
            setHasLoadedContent(true);
        }
    }, [currentBlog, id, editor, hasLoadedContent]);

    const handleSave = async () => {
        if (!title || !editor?.getText()) {
            alert('Please fill in both title and content');
            return;
        }

        const generatedSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const blogData = {
            title,
            content: editor.getHTML(),
            image_url: imageUrl,
            slug: generatedSlug,
            user_id: user?.id,
        };

        try {
            if (id) {
                await dispatch(updateBlogAsync({ id, ...blogData })).unwrap();
            } else {
                await dispatch(createBlog(blogData)).unwrap();
            }
            navigate('/blog');
        } catch (err: any) {
            console.error('Failed to save blog:', err);
            alert(`Failed to save blog: ${err.message || 'Unknown error'}`);
        }

    };

    if (!editor) {
        return null;
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-[#111418] dark:text-[#f0f2f4] font-sans">
            <div className="layout-container flex h-full grow flex-col">
                <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] dark:border-[#2d394a] bg-white dark:bg-[#1a2432] px-6 sm:px-10 py-3">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-3 text-[#111418] dark:text-white">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-xl">edit_note</span>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">SimpleBlog</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/blog')}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-transparent hover:bg-[#f0f2f4] dark:hover:bg-[#2d394a] text-[#111418] dark:text-white text-sm font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined mr-2">arrow_back</span>
                            <span className="truncate">Exit</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-[#617289] dark:text-[#9ba8ba] italic hidden sm:block">
                            {id ? 'Editing existing post' : 'Drafting new post'}
                        </span>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                            className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">{id ? 'Save Changes' : 'Publish Post'}</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center py-8">
                    <div className="layout-content-container flex flex-col w-full max-w-[840px] px-6">

                        <div className="group relative mb-8">
                            <div className="w-full bg-[#f0f2f4] dark:bg-[#1a2432] border-2 border-dashed border-[#dbe0e6] dark:border-[#2d394a] flex flex-col items-center justify-center overflow-hidden rounded-xl min-h-[320px] cursor-pointer hover:border-primary/50 transition-all relative">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Cover" className="w-full h-[320px] object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-[#617289] dark:text-[#9ba8ba]">
                                        <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                                        <span className="text-sm font-medium">Add a cover image URL</span>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Paste image URL here..."
                                    className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        <div className="w-full mb-2">
                            <input
                                className="w-full border-none bg-transparent px-4 py-4 text-[#111418] dark:text-white text-[32px] sm:text-[42px] font-bold leading-tight placeholder:text-[#bac3ce] focus:ring-0 focus:outline-none"
                                placeholder="Blog Title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="w-full mb-6 px-4">
                            <div className="flex items-center gap-2 text-sm text-[#617289] dark:text-[#9ba8ba]">
                                <span className="material-symbols-outlined text-sm">link</span>
                                <span>simpleblog.com/{username}/</span>
                                <input
                                    className="bg-transparent border-b border-dashed border-[#dbe0e6] dark:border-[#2d394a] focus:border-primary focus:outline-none px-1 py-0.5 text-primary font-medium"
                                    placeholder="url-slug"
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))}
                                />
                            </div>
                        </div>

                        <MenuBar editor={editor} />

                        <div className="flex flex-col gap-3 min-h-[500px]">
                            <EditorContent editor={editor} />
                        </div>

                        {id && currentBlog && (
                            <footer className="mt-12 py-8 border-t border-[#dbe0e6] dark:border-[#2d394a] flex flex-col sm:flex-row justify-between gap-4 text-sm text-[#617289] dark:text-[#9ba8ba]">
                                <div className="flex gap-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-xs uppercase tracking-tighter text-[#111418] dark:text-white">Created At</span>
                                        <span>{new Date(currentBlog.created_at || '').toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-xs uppercase tracking-tighter text-[#111418] dark:text-white">Last Updated</span>
                                        <span>{new Date(currentBlog.updated_at || '').toLocaleString()}</span>
                                    </div>
                                </div>
                            </footer>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BlogForm;
