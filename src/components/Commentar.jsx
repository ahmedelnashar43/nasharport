import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { getDocs, addDoc, collection, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-comment';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Trash2 } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

const Comment = memo(({ comment, formatDate, index }) => (
    <div 
        className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5"
        
    >
        <div className="flex items-start gap-3 ">
            {comment.profileImage ? (
                <img
                    src={comment.profileImage}
                    alt={`${comment.userName}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
                    loading="lazy"
                />
            ) : (
                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="font-medium text-white truncate">{comment.userName}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">{comment.content}</p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return;
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    Profile Photo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full" >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    useEffect(() => {
        const commentsRef = collection(db, 'portfolio-comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));
        
        return onSnapshot(q, (querySnapshot) => {
            const commentsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentsData);
        });
    }, []);

    const clearAllComments = async () => {
        Swal.fire({
            title: 'Delete All Comments?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete all'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const commentsRef = collection(db, 'portfolio-comments');
                    const snapshot = await getDocs(commentsRef);
                    
                    Swal.fire({
                        title: 'Deleting...',
                        html: 'Deleting all comments',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    
                    // Delete all comments
                    const deletePromises = snapshot.docs.map(document => 
                        deleteDoc(doc(db, 'portfolio-comments', document.id))
                    );
                    
                    await Promise.all(deletePromises);
                    
                    Swal.fire(
                        'Deleted!',
                        'All comments have been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error("Error deleting comments: ", error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete comments.',
                        'error'
                    );
                }
            }
        });
    };

    // Function to toggle admin mode
    const toggleAdmin = () => {
        if (!isAdmin) {
            Swal.fire({
                title: 'Admin Authentication',
                input: 'password',
                inputPlaceholder: 'Enter admin password',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Login',
                showLoaderOnConfirm: true,
                preConfirm: (password) => {
                    // Simple password check - you might want to make this more secure
                    return password === 'admin123';
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    setIsAdmin(true);
                    Swal.fire('Authenticated!', 'You now have admin access.', 'success');
                } else if (result.isConfirmed) {
                    Swal.fire('Invalid Password!', 'Authentication failed.', 'error');
                }
            });
        } else {
            setIsAdmin(false);
        }
    };

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        const storageRef = ref(storage, `profile-images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        return getDownloadURL(storageRef);
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        
        try {
            let profileImageUrl = null;
            
            // Try to upload image if provided
            if (imageFile) {
                try {
                    profileImageUrl = await uploadImage(imageFile);
                } catch (imageError) {
                    console.error('Error uploading image:', imageError);
                    // Continue without image if upload fails
                }
            }
            
            // Add comment to Firestore
            await addDoc(collection(db, 'portfolio-comments'), {
                content: newComment,
                userName,
                profileImage: profileImageUrl,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            
            // Show more specific error message
            if (error.code === 'permission-denied') {
                setError('Permission denied. Firebase security rules are preventing comment submission.');
            } else if (error.code === 'unavailable') {
                setError('Firebase service is currently unavailable. Please try again later.');
            } else {
                setError(`Failed to post comment: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <MessageCircle className="text-indigo-400" />
                    <h3 className="text-xl font-semibold">Comments</h3>
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                        {comments.length}
                    </span>
                </div>
                
                {/* Hidden admin button - double click to show admin options */}
                <button 
                    type="button"
                    onDoubleClick={toggleAdmin}
                    className="opacity-0 hover:opacity-50 text-gray-400 text-xs"
                >
                    Admin
                </button>
            </div>

            {isAdmin && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-red-400 font-medium">Admin Panel</span>
                        <button
                            onClick={clearAllComments}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear All Comments</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4 mb-8">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-amber-400 bg-amber-400/10 rounded-xl">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <CommentForm
                    onSubmit={handleCommentSubmit}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            </div>

            <div className="space-y-4 mt-8">
                <h4 className="text-lg font-medium">Recent Comments</h4>
                {comments.length === 0 ? (
                    <div className="text-center p-8 border border-white/10 rounded-xl bg-white/5">
                        <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-2 opacity-30" />
                        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {comments.map((comment, index) => (
                            <Comment key={comment.id} comment={comment} formatDate={formatDate} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Komentar;