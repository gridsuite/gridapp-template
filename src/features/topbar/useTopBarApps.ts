/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import { MetadataJson, fetchAppsAndUrls } from '@/shared/api/metadata';
import { SessionState } from '../auth/model/types';

export function useTopBarApps(user?: SessionState['user']): MetadataJson[] {
    const [appsAndUrls, setAppsAndUrls] = useState<MetadataJson[]>([]);

    useEffect(() => {
        if (user !== null) {
            fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    return appsAndUrls;
}
