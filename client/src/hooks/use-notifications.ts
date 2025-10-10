
import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  }, []);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if (permission === 'granted' && 'Notification' in window) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: newNotification.id,
        requireInteraction: notification.persistent,
        timestamp: notification.timestamp.getTime(),
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        markAsRead(newNotification.id);
      };

      // Auto-close non-persistent notifications
      if (!notification.persistent) {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }

    // Store in localStorage for persistence
    try {
      const stored = localStorage.getItem('notifications') || '[]';
      const existing = JSON.parse(stored);
      existing.unshift(newNotification);
      localStorage.setItem('notifications', JSON.stringify(existing.slice(0, 50)));
    } catch (error) {
      console.warn('Failed to store notification:', error);
    }

    return newNotification.id;
  }, [permission]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Update localStorage
    try {
      const stored = localStorage.getItem('notifications') || '[]';
      const existing = JSON.parse(stored);
      const updated = existing.map((notif: Notification) => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to update notification:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);

    try {
      const stored = localStorage.getItem('notifications') || '[]';
      const existing = JSON.parse(stored);
      const updated = existing.map((notif: Notification) => ({ ...notif, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to update notifications:', error);
    }
  }, []);

  // Clear notification
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const filtered = prev.filter(notif => notif.id !== id);
      const wasUnread = prev.find(notif => notif.id === id && !notif.read);
      if (wasUnread) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return filtered;
    });

    try {
      const stored = localStorage.getItem('notifications') || '[]';
      const existing = JSON.parse(stored);
      const updated = existing.filter((notif: Notification) => notif.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to clear notification:', error);
    }
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      localStorage.removeItem('notifications');
    } catch (error) {
      console.warn('Failed to clear notifications:', error);
    }
  }, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.warn('Failed to load notifications:', error);
    }

    // Check current permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Auto-generate notifications based on metrics changes
  const createMetricNotification = useCallback((
    metric: string, 
    value: number, 
    threshold: number, 
    type: 'increase' | 'decrease' = 'increase'
  ) => {
    const isAlert = type === 'increase' ? value > threshold : value < threshold;
    if (isAlert) {
      addNotification({
        title: `${metric} Alert`,
        message: `${metric} is ${type === 'increase' ? 'above' : 'below'} threshold: ${value}`,
        type: type === 'increase' ? 'warning' : 'error',
        timestamp: new Date(),
        read: false,
        persistent: true
      });
    }
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    permission,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    requestPermission,
    createMetricNotification,
  };
}
