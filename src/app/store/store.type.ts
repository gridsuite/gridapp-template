import { AuthenticationActions } from '@gridsuite/commons-ui';
import { AuthenticationState } from 'features/authentication/store/authentication.type';
import { baseApi } from 'shared/api/base-api';

export type AppState = {
    authentication: AuthenticationState;
    [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
};

export type Actions = AuthenticationActions;
