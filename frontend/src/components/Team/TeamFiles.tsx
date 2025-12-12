import React from 'react';
import { MoreHorizontal, FileText, Image, File } from 'lucide-react';

interface TeamFile {
    id: number;
    name: string;
    type: 'pdf' | 'image' | 'ppt';
    size: string;
    date: string;
    author: {
        name: string;
        avatar: string;
    };
}

const TeamFiles: React.FC = () => {
    const files: TeamFile[] = [
        {
            id: 1,
            name: "Document.pdf",
            type: "pdf",
            size: "2.3 MB",
            date: "Mar 1, 2025",
            author: { name: "Mandy Harley", avatar: "https://i.pravatar.cc/150?u=mandy1" }
        },
        {
            id: 2,
            name: "Image.png",
            type: "image",
            size: "2.3 MB",
            date: "Mar 1, 2025",
            author: { name: "Mandy Harley", avatar: "https://i.pravatar.cc/150?u=mandy2" }
        },
        {
            id: 3,
            name: "Document.pdf",
            type: "pdf",
            size: "2.3 MB",
            date: "Mar 1, 2025",
            author: { name: "Mandy Harley", avatar: "https://i.pravatar.cc/150?u=mandy3" }
        },
        {
            id: 4,
            name: "Presentation.pptx",
            type: "ppt",
            size: "2.3 MB",
            date: "Mar 1, 2025",
            author: { name: "Mandy Harley", avatar: "https://i.pravatar.cc/150?u=mandy4" }
        },
        {
            id: 5,
            name: "Image.png",
            type: "image",
            size: "2.3 MB",
            date: "Mar 1, 2025",
            author: { name: "Mandy Harley", avatar: "https://i.pravatar.cc/150?u=mandy5" }
        },
        {
            id: 6,
            name: "Document.pdf",
            type: "pdf",
            size: "2.3 MB",
            date: "Mar 1, 2025",
            author: { name: "Mandy Harley", avatar: "https://i.pravatar.cc/150?u=mandy6" }
        }
    ];

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return <FileText className="text-red-500" size={20} />;
            case 'image':
                return <Image className="text-teal-500" size={20} />;
            case 'ppt':
                return <File className="text-blue-500" size={20} />;
            default:
                return <FileText className="text-gray-500" size={20} />;
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
                    {files.map((file) => (
                        <div key={file.id} className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 h-[43px] items-center bg-white hover:bg-gray-50 transition-colors">
                            {/* Name Column */}
                            <div className="flex items-center gap-3">
                                <div className="p-1">
                                    {getFileIcon(file.type)}
                                </div>
                                <span className="text-sm font-semibold text-gray-600">{file.name}</span>
                            </div>

                            {/* Size */}
                            <div className="text-sm text-gray-500">
                                {file.size}
                            </div>

                            {/* Date */}
                            <div className="text-sm text-gray-500">
                                {file.date}
                            </div>

                            {/* Author */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={file.author.avatar}
                                        alt={file.author.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm text-gray-600">{file.author.name}</span>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamFiles;
