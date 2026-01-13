import React from "react";
import { Send } from "lucide-react";
import type { TaskCommentsProps } from "../../types";

const TaskComments: React.FC<TaskCommentsProps> = ({
  comments,
  user,
  newComment,
  setNewComment,
  onAddComment,
  isSubmitting,
  isTeamMember = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddComment();
    }
  };

  return (
    <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
      {comments && comments.length > 0 && (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {comment.author?.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full mt-1"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold mt-1">
                  {(comment.author?.name || "U").charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {comment.author?.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isTeamMember && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex items-start gap-3 shadow-sm hover:shadow-md dark:shadow-gray-900/50 transition-shadow focus-within:ring-1 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 focus-within:border-blue-300 dark:focus-within:border-blue-700 bg-white dark:bg-gray-800">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-bold flex-shrink-0">
              {(user?.name || "Me").charAt(0)}
            </div>
          )}
          <textarea
            placeholder="Add a comment..."
            className="flex-1 outline-none text-sm min-h-[40px] resize-none py-1.5 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent text-gray-700 dark:text-gray-200"
            rows={1}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={onAddComment}
            disabled={!newComment.trim() || isSubmitting}
            className={`p-1 transition-colors ${!newComment.trim() || isSubmitting ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"}`}
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskComments;
