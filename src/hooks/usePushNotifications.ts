import { useState, useEffect, useCallback } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | 'default';
  subscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    permission: 'default',
    subscription: null,
    isLoading: false,
    error: null,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported =
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;

      setState(prev => ({
        ...prev,
        isSupported,
        permission: isSupported ? Notification.permission : 'default'
      }));

      if (isSupported && Notification.permission === 'granted') {
        // Check existing subscription
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        setState(prev => ({
          ...prev,
          isSubscribed: !!subscription,
          subscription
        }));
      }
    };

    checkSupport();
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers not supported');
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    return registration;
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const permission = await Notification.requestPermission();

      setState(prev => ({
        ...prev,
        permission,
        isLoading: false
      }));

      return permission === 'granted';
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to request permission',
        isLoading: false
      }));
      return false;
    }
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // First register service worker
      const registration = await registerServiceWorker();

      // Request permission if not already granted
      if (Notification.permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error('Permission not granted');
        }
      }

      // Subscribe to push
      // Note: In production, you would use a real VAPID public key
      // For demo purposes, we'll use a placeholder
      const vapidPublicKey = 'BMblWRWH0pW-oQRjPgm0DZJ-TdB1VBKOYcOzWWFHSXbLNBbU9dS8hLiPfG9rTvXqgCRKjDOI1P4WKHU8LqjHZ-E';

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription,
        isLoading: false
      }));

      // In production, send subscription to your server
      console.log('Push subscription:', JSON.stringify(subscription));

      return subscription;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to subscribe',
        isLoading: false
      }));
      return null;
    }
  }, [registerServiceWorker, requestPermission]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        isLoading: false
      }));

      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to unsubscribe',
        isLoading: false
      }));
      return false;
    }
  }, []);

  // Send a test notification (for demo purposes)
  const sendTestNotification = useCallback(async () => {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification('Orbi City Batumi', {
      body: 'Welcome! Get 20% off your first booking with code WELCOME20',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'test-notification',
      vibrate: [100, 50, 100],
      data: {
        url: '/apartments'
      },
      actions: [
        { action: 'book', title: 'Book Now' },
        { action: 'close', title: 'Later' }
      ]
    });
  }, []);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
