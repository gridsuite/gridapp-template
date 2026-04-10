import { SnackInputs, useSnackMessage } from '@gridsuite/commons-ui';
import { useAppSelector } from 'app/store/store';
import { useEffect } from 'react';
import { selectLastNotification } from 'shared/store/notifications/notifications.selectors';
import { NotificationType } from 'shared/store/notifications/notifications.slice';

export function NotificationsListener() {
    const notification = useAppSelector(selectLastNotification);
    const { snackError, snackInfo, snackSuccess, snackWarning } = useSnackMessage();

    const snackMethod: Record<NotificationType, (snackInput: SnackInputs) => void> = {
        error: snackError,
        info: snackInfo,
        success: snackSuccess,
        warning: snackWarning,
    };

    useEffect(() => {
        if (!notification) {
            return;
        }

        const payload = {
            headerId: notification.messageId,
            messageTxt: notification.message ?? undefined,
        };

        const snack = snackMethod[notification.type ?? 'error'];

        snack(payload);
    }, [notification, snackError, snackInfo, snackSuccess, snackWarning]);

    return null;
}
