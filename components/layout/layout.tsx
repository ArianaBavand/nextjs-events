import MainHeader from './main-header';
import Notification from '../ui/notification';
import { useContext } from 'react';
import { NotificationContext } from '@/store/notification-context';

export default function Layout(props: React.PropsWithChildren) {
  const notificationCtx = useContext(NotificationContext);

  const activeNotification = notificationCtx.notification;

  return (
    <>
      <MainHeader />
      <main>{props.children}</main>
      {/* Use optional chaining to safely access properties */}
      {activeNotification && (
        <Notification
          title={activeNotification?.title}
          message={activeNotification?.message}
          status={activeNotification?.status}
        />
      )}
    </>
  );
}
