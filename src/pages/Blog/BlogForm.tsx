import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBlogById, createBlog, updateBlogAsync, clearCurrentBlog } from '../../features/blogSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import { Logo } from '../../components/Logo';
import { supabase } from '../../supabaseClient';

interface MenuBarProps {
    editor: Editor | null;
    onInsertImage: (file: File) => Promise<void>;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, onInsertImage }) => {
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
                <button
                    type="button"
                    onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                                onInsertImage(file);
                            }
                        };
                        input.click();
                    }}
                    className={`p-2 rounded transition-colors text-[#617289] dark:text-[#9ba8ba] hover:bg-gray-100 dark:hover:bg-gray-800`}
                    title="Insert Image"
                >
                    <span className="material-symbols-outlined text-[20px]">image</span>
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
    const [isUploading, setIsUploading] = useState(false);
    const [slug, setSlug] = useState('');
    const [hasLoadedContent, setHasLoadedContent] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!user?.id) {
            alert('Please log in to upload images.');
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (data?.publicUrl) {
                setImageUrl(data.publicUrl);
            } else {
                throw new Error('Public URL not found');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(`Upload failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleInsertImage = async (file: File) => {
        if (!user?.id || !editor) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
            const filePath = `${user.id}/content-${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (data?.publicUrl) {
                if ('setImage' in editor.commands) {
                    editor.chain().focus().setImage({ src: data.publicUrl }).run();
                } else {
                    console.error('Tiptap Image extension is not loaded properly.');
                    alert('Image extension failed to load. Please restart your dev server and refresh the page.');
                }
            }
        } catch (error: any) {
            console.error('Image upload failed:', error);
            alert(`Failed to upload image to content: ${error.message || 'Unknown error'}`);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            TiptapImage.configure({
                allowBase64: true,
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
                await dispatch(updateBlogAsync({
                    id,
                    ...blogData,
                    updated_at: new Date().toISOString()
                })).unwrap();
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
                <header className="sticky top-0 z-50 whitespace-nowrap border-b border-solid border-[#dbe0e6] dark:border-[#2d394a] bg-white dark:bg-[#1a2432] h-16">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 sm:gap-8">
                            <Logo link />
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
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center py-8">
                    <div className="layout-content-container flex flex-col w-full max-w-[840px] px-6">

                        <div className="group relative mb-12">
                            <label className="block w-full" htmlFor="cover-image-upload">
                                <input
                                    id="cover-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <div className={`
                                    w-full bg-[#f0f2f4] dark:bg-[#1a2432] border-2 border-dashed 
                                    transition-all duration-300 relative overflow-hidden rounded-[2rem] min-h-[400px] 
                                    flex flex-col items-center justify-center cursor-pointer group
                                    ${imageUrl ? 'border-transparent shadow-2xl' : 'border-[#dbe0e6] dark:border-[#2d394a] hover:border-primary/50'}
                                    ${isUploading ? 'opacity-80 cursor-wait' : ''}
                                `}>
                                    {imageUrl ? (
                                        <>
                                            <img src={imageUrl} alt="Cover" className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-white flex flex-col items-center gap-2">
                                                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                                    <span className="text-sm font-bold">Replace cover photo</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setImageUrl('');
                                                    }}
                                                    className="bg-red-500/80 hover:bg-red-600 backdrop-blur-md text-white px-6 py-2 rounded-xl text-sm font-bold border border-red-400/30 transition-all"
                                                >
                                                    Remove Cover
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-6 text-[#617289] dark:text-[#9ba8ba]">
                                            <div className="w-20 h-20 bg-primary/10 dark:bg-white/5 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
                                            </div>
                                            <div className="text-center space-y-2">
                                                <span className="text-lg font-bold block text-[#111418] dark:text-white">Upload cover photo</span>
                                                <span className="text-sm">High-resolution images work best (1200x600px)</span>
                                            </div>
                                        </div>
                                    )}

                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px] z-30">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="mt-4 text-sm font-bold text-primary animate-pulse">Uploading Image...</p>
                                        </div>
                                    )}
                                </div>
                            </label>
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

                        <MenuBar editor={editor} onInsertImage={handleInsertImage} />

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
