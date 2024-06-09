import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Notification } from "blixify-ui-web/lib/components/display/notification";

export interface NotificationState {
  type: boolean;
  title: string;
  msg: string;
}

interface Props {
  notification: NotificationState | null;
  onClose: any;
}

export default function CustomNotification(props: Props) {
  const correctIcon = (
    <CheckCircleIcon className="w-10 h-10 text-primary-600" />
  );
  const incorrectIcon = <XCircleIcon className="w-10 h-10 text-red-600" />;
  if (props.notification) {
    return (
      <Notification
        icon={props.notification.type ? correctIcon : incorrectIcon}
        notificationAttribute={{
          title: props.notification.title,
          desc: props.notification.msg,
          visible: true,
        }}
        lib={{
          Transition,
        }}
        darkMode
        onClose={() => {
          props.onClose();
          return "";
        }}
      />
    );
  }
  return null;
}
