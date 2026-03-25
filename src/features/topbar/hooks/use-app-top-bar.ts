/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { logout } from '@gridsuite/commons-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { AppTopBarProps } from '@/app/layout/AppTopBar';
import { AppDispatch } from '@/app/store';
import { selectTheme } from '@/features/app-settings/store/selectors';
import { PARAM_LANGUAGE, PARAM_THEME } from '@/shared/config/parameters';
import { getServersInfos } from '../api/fetch-about';
import { useParameterState } from './use-parameter-state';
import { useTopBarApps } from './use-top-bar-apps';
import { useTopBarVersion } from './use-top-bar-version';

export function useAppTopBar(props: AppTopBarProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector(selectTheme);
    const appsAndUrls = useTopBarApps(props.user);
    const globalVersionPromise = useTopBarVersion();
    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] = useParameterState(PARAM_LANGUAGE);
    const [showParameters, setShowParameters] = useState(false);

    const displayParameters = useCallback(() => setShowParameters(true), []);
    const hideParameters = useCallback(() => setShowParameters(false), []);
    const onLogoutClick = useCallback(
        () => logout(dispatch, props.userManager.instance),
        [dispatch, props.userManager]
    );
    const onLogoClick = useCallback(() => navigate('/', { replace: true }), [navigate]);

    return {
        additionalModulesPromise: getServersInfos,
        appsAndUrls,
        displayParameters,
        globalVersionPromise,
        handleChangeLanguage,
        handleChangeTheme,
        hideParameters,
        languageLocal,
        onLogoClick,
        onLogoutClick,
        showParameters,
        theme,
        themeLocal,
    };
}
