import { useState, useEffect } from 'react';

declare global {
  interface Window {
    OneSignal: any;
    OneSignalDeferred: any[];
  }
}

const useNotifications = () => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    checkPermission();
    
    // Set up subscription change handler using OneSignalDeferred
    window.OneSignalDeferred?.push((OneSignal: any) => {
      OneSignal.Notifications.addEventListener('permissionChange', (permission: boolean) => {
        console.log('Permission changed:', permission);
        checkPermission();
      });
    });

    return () => {
      // Clean up by removing event listeners
      window.OneSignalDeferred?.push((OneSignal: any) => {
        OneSignal.Notifications.removeEventListener('permissionChange');
      });
    };
  }, []);

  const checkPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.permission;
      setNotificationPermission(permission);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      window.OneSignalDeferred?.push(async (OneSignal: any) => {
        try {
          const permission = await OneSignal.Notifications.requestPermission();
          console.log('Permission request result:', permission);
          
          if (permission) {
            await checkPermission();
            // Set user tags after permission granted
            await OneSignal.User.addTag('app_user', 'true');
          }
        } catch (error) {
          console.error('Error in OneSignal permission request:', error);
        }
      });
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return {
    notificationPermission,
    requestNotificationPermission
  };
};

export default useNotifications;