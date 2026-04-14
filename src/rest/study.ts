/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { GridSuiteModule } from '@gridsuite/commons-ui';
import { backendFetchJson } from '../utils/rest-api';
import { getErrorMessage } from '../utils/error';

const API_URL = `${import.meta.env.VITE_API_GATEWAY}/study/v1`;

export function getServersInfos() {
    return backendFetchJson(`${API_URL}/servers/about?view=yyy`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
    }).catch((error) => {
        console.error(`Error while fetching the servers infos : ${getErrorMessage(error)}`);
        throw error;
    }) as Promise<GridSuiteModule[]>;
}
