import React from "react";
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "../../store/api/notificationApiSlice";
import type {
  NotificationsPopupProps,
  NotificationItemProps,
} from "../../types";

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const actorName = notification.actor?.name || "Someone";
  const actorAvatar =
    notification.actor?.avatar ||
    `https://i.pravatar.cc/150?u=${notification.actorId}`;

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`p-4 transition-colors cursor-pointer ${
        notification.isRead
          ? "hover:bg-gray-50 dark:hover:bg-gray-700/50"
          : "bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30"
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <img
          src={actorAvatar}
          alt={actorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            <span className="font-medium">{actorName}</span>{" "}
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        )}
      </div>
    </div>
  );
};

const NotificationsPopup: React.FC<NotificationsPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(
    undefined,
    {
      pollingInterval: 30000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllAsReadMutation();
  const [markAsRead] = useMarkAsReadMutation();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[99]" onClick={handleBackdropClick} />

      <div className="fixed left-[280px] top-4 w-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[100] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
          <button
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || unreadCount === 0}
          >
            {isMarkingAll ? "Marking..." : "Mark all as read"}
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>No notifications yet</p>
              <p className="text-sm mt-1">You'll see task assignments here</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPopup;
