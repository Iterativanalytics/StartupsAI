import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  business?: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
}

export interface AlertConfig {
  enabled: boolean;
  scoreThreshold: number;
  riskThreshold: number;
  volumeThreshold: number;
  emailNotifications: boolean;
  soundNotifications: boolean;
}

/**
 * Hook for managing real-time alerts and notifications
 */
export function useRealTimeAlerts() {
  const [alerts, setAlerts] = useLocalStorage<Alert[]>('credit_alerts', []);
  const [alertConfig, setAlertConfig] = useLocalStorage<AlertConfig>('alert_config', {
    enabled: true,
    scoreThreshold: 600,
    riskThreshold: 0.25,
    volumeThreshold: 10,
    emailNotifications: false,
    soundNotifications: true
  });
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  // Add new alert
  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp' | 'read' | 'dismissed'>) => {
    if (!alertConfig.enabled) return;

    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 100)); // Keep last 100 alerts

    // Play sound notification if enabled
    if (alertConfig.soundNotifications && typeof window !== 'undefined') {
      playNotificationSound(alert.type);
    }

    // Show browser notification if permissions granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: newAlert.id
      });
    }
  }, [alertConfig, setAlerts]);

  // Mark alert as read
  const markAsRead = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  }, [setAlerts]);

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  }, [setAlerts]);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, [setAlerts]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, read: true }))
    );
  }, [setAlerts]);

  // Get active (non-dismissed) alerts
  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  // Get unread alerts count
  const unreadCount = activeAlerts.filter(alert => !alert.read).length;

  // Check for score-based alerts
  const checkScoreAlert = useCallback((companyName: string, score: number) => {
    if (alertConfig.enabled && score < alertConfig.scoreThreshold) {
      addAlert({
        type: score < 500 ? 'danger' : 'warning',
        title: 'Low Credit Score Alert',
        message: `${companyName} has a credit score of ${score}, below the threshold of ${alertConfig.scoreThreshold}`,
        business: companyName
      });
    }
  }, [alertConfig, addAlert]);

  // Check for risk-based alerts
  const checkRiskAlert = useCallback((companyName: string, riskProbability: number) => {
    if (alertConfig.enabled && riskProbability > alertConfig.riskThreshold) {
      addAlert({
        type: riskProbability > 0.4 ? 'danger' : 'warning',
        title: 'High Default Risk Alert',
        message: `${companyName} has a default risk of ${(riskProbability * 100).toFixed(2)}%, above the threshold of ${(alertConfig.riskThreshold * 100).toFixed(2)}%`,
        business: companyName
      });
    }
  }, [alertConfig, addAlert]);

  // Check for volume-based alerts
  const checkVolumeAlert = useCallback((assessmentCount: number) => {
    if (alertConfig.enabled && assessmentCount >= alertConfig.volumeThreshold) {
      addAlert({
        type: 'info',
        title: 'High Volume Alert',
        message: `${assessmentCount} assessments processed today, reaching the volume threshold of ${alertConfig.volumeThreshold}`,
      });
    }
  }, [alertConfig, addAlert]);

  // System alert for model performance
  const addSystemAlert = useCallback((title: string, message: string, type: Alert['type'] = 'info') => {
    addAlert({
      type,
      title,
      message
    });
  }, [addAlert]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback((type: Alert['type']) => {
    if (typeof window === 'undefined') return;

    // Create audio context for different alert sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const frequencies = {
      info: 440,
      success: 523,
      warning: 659,
      danger: 784
    };

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequencies[type] || 440, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  // Update alert configuration
  const updateAlertConfig = useCallback((updates: Partial<AlertConfig>) => {
    setAlertConfig(prev => ({ ...prev, ...updates }));
  }, [setAlertConfig]);

  // Auto-dismiss old alerts (30 days)
  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setAlerts(prev => 
      prev.filter(alert => new Date(alert.timestamp) > thirtyDaysAgo)
    );
  }, [setAlerts]);

  return {
    // Alert data
    alerts: activeAlerts,
    alertConfig,
    unreadCount,
    
    // Modal state
    isAlertsModalOpen,
    setIsAlertsModalOpen,
    
    // Alert actions
    addAlert,
    markAsRead,
    dismissAlert,
    clearAllAlerts,
    markAllAsRead,
    
    // Alert checkers
    checkScoreAlert,
    checkRiskAlert,
    checkVolumeAlert,
    addSystemAlert,
    
    // Configuration
    updateAlertConfig,
    
    // Notification permissions
    requestNotificationPermission,
    
    // Utilities
    playNotificationSound
  };
}

export default useRealTimeAlerts;
