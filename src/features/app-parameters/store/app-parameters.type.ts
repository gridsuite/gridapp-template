/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, GsLangUser, GsTheme } from '@gridsuite/commons-ui';

export type AppParameters = {
    language: GsLang;
    computedLanguage: GsLangUser;
    theme: GsTheme;
};

export type AppParametersKey = keyof AppParameters;
