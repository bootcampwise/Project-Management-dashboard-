import React from "react";
import {
  MoreHorizontal,
  FileText,
  Image,
  File,
  Loader2,
  Trash2,
} from "lucide-react";
import type { TeamFile, TeamFilesProps } from "../../../types";
import { format } from "date-fns";
import { showToast } from "../../../components/ui";

const TeamFiles: React.FC<TeamFilesProps> = ({
  activeTeam,
  allTeams = [],
  files,
  isLoading,
  openMenuId,
  deletingId,
  menuRef,
  formatSize,
  handleFileClick,
  handleMenuClick,
  handleDeleteFile,
  setOpenMenuId,
}) => {
  const getFileIcon = (file: TeamFile) => {
    const type = file.type || file.mimeType || "";
    if (type.includes("image"))
      return <Image className="text-teal-500" size={20} />;
    if (type.includes("pdf"))
      return <FileText className="text-red-500" size={20} />;
    return <File className="text-blue-500" size={20} />;
  };

  const handleDelete = (e: React.MouseEvent, file: TeamFile) => {
    e.stopPropagation();
    setOpenMenuId(null);

    showToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 min-w-[280px] border border-gray-100 dark:border-gray-700`}
        >
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              Delete File?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                "{file.name}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => showToast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast.dismiss(t.id);
                handleDeleteFile(file);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      },
    );
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-900">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div>Name</div>
          <div>size</div>
          <div>date upload</div>
          <div>Author</div>
        </div>

        <div className="flex flex-col gap-[2px] bg-gray-50 dark:bg-gray-800">
          {(!activeTeam &&
            (!allTeams || !allTeams.some((t) => t.projects?.length))) ||
          (activeTeam && !activeTeam.projects?.length) ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm italic">
              No projects assigned to {activeTeam ? "this team" : "any team"}.
            </div>
          ) : isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 h-[43px] items-center bg-white dark:bg-gray-900 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  </div>
                </div>
              ))}
            </>
          ) : files.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm italic">
              No files uploaded by team members.
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className={`grid grid-cols-[2.5fr_1fr_1fr_1.5fr] gap-4 px-6 h-[43px] items-center bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer overflow-visible ${
                  deletingId === file.id ? "opacity-50" : ""
                } `}
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-1 flex-shrink-0">{getFileIcon(file)}</div>
                  <span
                    className="text-sm font-semibold text-gray-600 dark:text-gray-300 truncate hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatSize(file.size)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {file.createdAt
                    ? format(new Date(file.createdAt), "MMM d, yyyy")
                    : "-"}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                    {file.user?.avatar ? (
                      <img
                        src={file.user.avatar}
                        alt={file.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                        {file.user?.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {file.user?.name || "Unknown"}
                    </span>
                  </div>

                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => handleMenuClick(e, file.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1"
                        style={{ zIndex: 9999 }}
                      >
                        <button
                          onClick={(e) => handleDelete(e, file)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamFiles;
