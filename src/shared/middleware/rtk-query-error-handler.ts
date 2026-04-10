import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { getErrorMessage } from 'shared/lib/error';
import { pushNotification } from 'shared/store/notifications/notifications.slice';

type RtkQueryRejectedMetadataArgs = {
    endpointName?: string;
    originalArgs?: unknown;
    type?: 'query' | 'mutation';
};

export const rtkQueryErrorMiddleware: Middleware = (api) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const error = action.payload ?? action.error;
        const actionMetadata = action.meta.arg as RtkQueryRejectedMetadataArgs;

        api.dispatch(
            pushNotification({
                messageId: actionMetadata.endpointName,
                message: getErrorMessage(error) ?? '',
                type: 'error',
            })
        );
    }

    return next(action);
};
