export interface NotificationActor {
  id: string;
  name: string | null;
  avatar: string | null;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  projectId: string | null;
  taskId: string | null;
  actorId: string | null;
  actor: NotificationActor | null;
  createdAt: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}
