import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: NotificationsState = {
    last: null,
};

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export type SnackBarNotification = {
    messageId?: string;
    message: string | null;
    type: NotificationType;
};

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        pushNotification(state, action: PayloadAction<SnackBarNotification>) {
            state.last = action.payload;
        },
    },
});

export type NotificationsState = {
    last: SnackBarNotification | null;
};

export const { pushNotification } = notificationsSlice.actions;

export const notificationsSliceReducer = notificationsSlice.reducer;
