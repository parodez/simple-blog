import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBlogById, createBlog, updateBlogAsync, clearCurrentBlog } from '../../features/blogSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import { supabase } from '../../supabaseClient';
import { MenuBar } from '../../components/Editor/MenuBar';
import { Navbar } from '../../components/Navbar';

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

    const navbarActions = (
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 px-4 h-10 text-[#617289] dark:text-slate-400 hover:text-primary transition-colors text-sm font-bold"
            >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                <span>Exit</span>
            </button>
            <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold h-10 px-6 rounded-full transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
                {id ? 'Save Changes' : 'Publish Post'}
            </button>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-sans">
            <Navbar actions={navbarActions} />

            <main className="flex flex-col items-center py-12">
                <div className="w-full max-w-[840px] px-6">
                    {/* Cover Image Upload */}
                    <div className="group relative mb-12">
                        <label className="block w-full cursor-pointer" htmlFor="cover-image-upload">
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
                                transition-all duration-300 relative overflow-hidden rounded-[2.5rem] min-h-[400px] 
                                flex flex-col items-center justify-center group
                                ${imageUrl ? 'border-transparent shadow-2xl shadow-primary/5' : 'border-[#dbe0e6] dark:border-[#2d394a] hover:border-primary/50'}
                            `}>
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Cover" className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />
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
                                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20"
                                            >
                                                Remove Cover
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-6 text-[#617289] dark:text-[#9ba8ba]">
                                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <span className="text-lg font-bold block text-[#111418] dark:text-white">Upload cover photo</span>
                                        </div>
                                    </div>
                                )}

                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px] z-30">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                        <p className="mt-4 text-sm font-bold text-primary animate-pulse">Uploading Image...</p>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>

                    <div className="w-full mb-2">
                        <input
                            className="w-full border-none bg-transparent px-4 py-4 text-[#111418] dark:text-white text-[32px] sm:text-[42px] font-black leading-tight placeholder:text-[#bac3ce] focus:ring-0 focus:outline-none"
                            placeholder="Post Title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="w-full mb-12 px-4 flex items-center gap-2 text-sm text-[#617289] dark:text-[#9ba8ba]">
                        <span className="material-symbols-outlined text-sm">link</span>
                        <span>parodez-simpleblpg.vercel.app/blog/{username}/</span>
                        <input
                            className="bg-transparent border-b border-dashed border-[#dbe0e6] dark:border-slate-800 focus:border-primary focus:outline-none px-1 py-0.5 text-primary font-bold"
                            placeholder="url-slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))}
                        />
                    </div>

                    <MenuBar editor={editor} onInsertImage={handleInsertImage} />

                    <div className="flex flex-col gap-3 min-h-[500px]">
                        <EditorContent editor={editor} />
                    </div>

                    {id && currentBlog && (
                        <footer className="mt-20 py-12 border-t border-[#dbe0e6] dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-8 text-sm text-[#617289] dark:text-[#9ba8ba]">
                            <div className="flex gap-12">
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-bold text-xs uppercase tracking-widest text-[#111418] dark:text-white">Created At</span>
                                    <span>{new Date(currentBlog.created_at || '').toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-bold text-xs uppercase tracking-widest text-[#111418] dark:text-white">Last Updated</span>
                                    <span>{new Date(currentBlog.updated_at || '').toLocaleString()}</span>
                                </div>
                            </div>
                        </footer>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BlogForm;
