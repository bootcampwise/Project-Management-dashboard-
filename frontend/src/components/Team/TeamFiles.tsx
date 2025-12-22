import React, { useEffect, useState, useRef } from 'react';
import { MoreHorizontal, FileText, Image, File, Loader2, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProjectAttachments } from '../../store/slices/projectSlice';
import type { TeamFile } from '../../types';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { apiClient } from '../../lib/apiClient';
import toast from 'react-hot-toast';

const TeamFiles: React.FC = () => {
    const dispatch = useAppDispatch();
    const { activeProject, files, isLoading } = useAppSelector(state => state.project);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeProject?.id) {
            // @ts-ignore
            dispatch(fetchProjectAttachments(activeProject.id));
        }
    }, [dispatch, activeProject?.id]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getFileIcon = (file: TeamFile) => {
        const type = file.type || file.mimeType || '';
        if (type.includes('image')) return <Image className="text-teal-500" size={20} />;
        if (type.includes('pdf')) return <FileText className="text-red-500" size={20} />;
        return <File className="text-blue-500" size={20} />;
    };

    const formatSize = (bytes: number | string) => {
        if (typeof bytes === 'string') return bytes;
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getFileUrl = (file: TeamFile): string | null => {
        const url = file.url || file.filePath;
        if (!url) return null;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        const cleanPath = url.startsWith('/') ? url.slice(1) : url;
        const { data } = supabase.storage.from('attachments').getPublicUrl(cleanPath);
        return data?.publicUrl || null;
    };

    const handleFileClick = (file: TeamFile) => {
        const fileUrl = getFileUrl(file);
        if (fileUrl) {
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleMenuClick = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === fileId ? null : fileId);
    };

    const handleDelete = async (e: React.MouseEvent, file: TeamFile) => {
        e.stopPropagation();
        setOpenMenuId(null);

        // Show confirmation toast
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[250px]">
                <div>
                    <h3 className="font-medium text-gray-900">Delete File?</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Are you sure you want to delete <span className="font-semibold">{file.name}</span>?
                    </p>
                </div>
                <div className="flex items-center justify-end gap-3 mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setDeletingId(file.id);
                            try {
                                // 1. Delete from Supabase storage
                                const filePath = file.url || file.filePath;
                                if (filePath && !filePath.startsWith('http')) {
                                    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
                                    await supabase.storage.from('attachments').remove([cleanPath]);
                                }

                                // 2. Delete from database
                                await apiClient.delete(`/attachments/${file.id}`);

                                // 3. Refresh the file list
                                if (activeProject?.id) {
                                    // @ts-ignore
                                    dispatch(fetchProjectAttachments(activeProject.id));
                                }
                                toast.success('File deleted successfully');
                            } catch (error) {
                                console.error('Failed to delete file:', error);
                                toast.error('Failed to delete file');
                            } finally {
                                setDeletingId(null);
                            }
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: "top-center"
        });
    };

    return (
        <div className="flex-1 bg-white">
            <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div>Name</div>
                    <div>size</div>
                    <div>date upload</div>
                    <div>Author</div>
                </div>

                {/* Rows with 2px gap */}
                <div className="flex flex-col gap-[2px] bg-gray-50">
                    {isLoading ? (
                        <div className="px-6 py-12 text-center">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
                            <span className="text-gray-500 text-sm">Loading files...</span>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500 text-sm italic">
                            No files found in this project.
                        </div>
                    ) : (
                        files.map((file) => (
                            <div
                                key={file.id}
                                className={`grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 h-[43px] items-center bg-white hover:bg-gray-50 transition-colors cursor-pointer overflow-visible ${deletingId === file.id ? 'opacity-50' : ''}`}
                                onClick={() => handleFileClick(file)}
                            >
                                {/* Name Column */}
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-1 flex-shrink-0">
                                        {getFileIcon(file)}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 truncate hover:text-blue-600 hover:underline" title={file.name}>{file.name}</span>
                                </div>

                                {/* Size */}
                                <div className="text-sm text-gray-500">
                                    {formatSize(file.size)}
                                </div>

                                {/* Date */}
                                <div className="text-sm text-gray-500">
                                    {file.createdAt ? format(new Date(file.createdAt), 'MMM d, yyyy') : '-'}
                                </div>

                                {/* Author */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                                        {file.user?.avatar ? (
                                            <img
                                                src={file.user.avatar}
                                                alt={file.user.name}
                                                className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                                                {file.user?.name?.charAt(0) || "?"}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-600 truncate">{file.user?.name || "Unknown"}</span>
                                    </div>

                                    {/* Three dots menu */}
                                    <div className="relative flex-shrink-0">
                                        <button
                                            onClick={(e) => handleMenuClick(e, file.id)}
                                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100"
                                        >
                                            {deletingId === file.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <MoreHorizontal size={18} />
                                            )}
                                        </button>

                                        {openMenuId === file.id && (
                                            <div
                                                ref={menuRef}
                                                className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
                                                style={{ zIndex: 9999 }}
                                            >
                                                <button
                                                    onClick={(e) => handleDelete(e, file)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
};

export default TeamFiles;

