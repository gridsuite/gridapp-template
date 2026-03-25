/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { fetchVersion } from '../../shared/api/metadata';

export function useTopBarVersion(): () => Promise<string> {
    return useCallback(() => fetchVersion().then((res) => res?.deployVersion ?? 'unknown'), []);
}
