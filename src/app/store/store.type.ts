/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AuthenticationActions } from '@gridsuite/commons-ui';
import { AuthenticationState } from 'features/authentication/store/authentication.type';
import { baseApi } from 'shared/api/base-api';

export type AppState = {
    authentication: AuthenticationState;
    [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
};

export type Actions = AuthenticationActions;
