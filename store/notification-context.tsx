import { createContext, ReactNode, useEffect, useState } from 'react';

// Define the type for the notification data
type NotificationData = {
  title: string;
  message: string;
  status: string;
};

// Define the type for the context value
type NotificationContextType = {
  notification: NotificationData | null;
  showNotification: (notificationData: NotificationData) => void;
  hideNotification: () => void;
};

// Create the context with an initial value
const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
});

// Define the props type for the NotificationContextProvider
type NotificationContextProviderProps = {
  children: ReactNode;
};

// NotificationContextProvider component
function NotificationContextProvider(props: NotificationContextProviderProps) {
  const [activeNotification, setActiveNotification] =
    useState<NotificationData | null>(null);

  useEffect(() => {
    if (
      activeNotification &&
      (activeNotification?.status === 'success' ||
        activeNotification?.status === 'error')
    ) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeNotification]);

  function showNotificationHandler(notificationData: NotificationData) {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  const context: NotificationContextType = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler, // Corrected spelling
  };

  return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export { NotificationContext, NotificationContextProvider };
