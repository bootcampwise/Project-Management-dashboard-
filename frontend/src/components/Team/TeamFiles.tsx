import React, { useEffect } from 'react';
import { MoreHorizontal, FileText, Image, File } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProjectAttachments } from '../../store/slices/projectSlice';
import type { TeamFile } from '../../types';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

const TeamFiles: React.FC = () => {
    const dispatch = useAppDispatch();
    const { activeProject, files } = useAppSelector(state => state.project);

    useEffect(() => {
        if (activeProject?.id) {
            // @ts-ignore
            dispatch(fetchProjectAttachments(activeProject.id));
        }
    }, [dispatch, activeProject?.id]);

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

    // Get the proper URL for a file - handles both full URLs and Supabase storage paths
    const getFileUrl = (file: TeamFile): string | null => {
        const url = file.url || file.filePath;
        if (!url) return null;

        // If it's already a full URL (starts with http), return as-is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // Remove any leading slash from the path
        const cleanPath = url.startsWith('/') ? url.slice(1) : url;

        // Get public URL from Supabase storage
        const { data } = supabase.storage.from('attachments').getPublicUrl(cleanPath);
        console.log('[TeamFiles] File URL generated:', { originalUrl: url, cleanPath, publicUrl: data?.publicUrl });
        return data?.publicUrl || null;
    };

    const handleFileClick = (file: TeamFile) => {
        const fileUrl = getFileUrl(file);
        console.log('[TeamFiles] Opening file:', { fileName: file.name, url: fileUrl });
        if (fileUrl) {
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
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
                    {files.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500 text-sm italic">
                            No files found in this project.
                        </div>
                    ) : (
                        files.map((file) => (
                            <div
                                key={file.id}
                                className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 h-[43px] items-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
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
                                <div className="flex items-center justify-between overflow-hidden">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        {file.user?.avatar ? (
                                            <img
                                                src={file.user.avatar}
                                                alt={file.user.name}
                                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {file.user?.name?.charAt(0) || "?"}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-600 truncate">{file.user?.name || "Unknown"}</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 ml-2">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
};

export default TeamFiles;
