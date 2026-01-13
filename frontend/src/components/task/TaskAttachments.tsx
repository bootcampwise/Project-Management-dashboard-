import React, { useRef } from "react";
import { FileText, Download, Plus } from "lucide-react";
import type { TaskAttachmentsProps } from "../../types";

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({
  attachments,
  onUpload,
  onDownload,
  isTeamMember = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Attachments
        </h3>
        <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
          · {attachments?.length || 0}
        </span>
      </div>
      <div className="flex flex-wrap gap-4">
        {attachments?.map((att) => (
          <div
            key={att.id}
            className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl min-w-[200px] hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group"
            onClick={(e) => onDownload(e, att)}
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
                {att.name}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                Download
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 dark:text-gray-500">
              <Download size={14} />
            </div>
          </div>
        ))}

        {isTeamMember && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Plus size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onUpload}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskAttachments;
