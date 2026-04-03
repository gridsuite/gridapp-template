/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    getLocalStorageComputedLanguage,
    getLocalStorageLanguage,
    getLocalStorageTheme,
} from './app-parameters.local-storage';
import { AppParameters } from './app-parameters.type';

export const initialAppParametersState: AppParameters = {
    language: getLocalStorageLanguage(),
    computedLanguage: getLocalStorageComputedLanguage(),
    theme: getLocalStorageTheme(),
};
