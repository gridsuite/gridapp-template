/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
    fetchAppsMetadata,
    LIGHT_THEME,
    logout,
    Metadata,
    PARAM_LANGUAGE,
    PARAM_THEME,
    TopBar,
    UserManagerState,
} from '@gridsuite/commons-ui';
import Parameters from '../../app-parameters/components/parameters';
import { APP_NAME } from '../../../app/config/config';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import PowsyblLogo from 'assets/images/powsybl_logo.svg?react';
import AppPackage from '../../../../package.json';
import { useAppParameterState } from '../../app-parameters/hooks/use-app-parameter-state';
import { AppDispatch } from 'app/store/store';
import { AppState } from 'app/store/reducer';
import { AuthenticationState } from 'features/authentication/store/authentication.type';
import { selectAppParameters } from 'features/app-parameters/store/app-parameters.selectors';
import { getServersInfos } from '../api/get-servers-infos';
import { fetchVersion } from 'shared/config/version';

export type AppTopBarProps = {
    user?: AuthenticationState['user'];
    userManager: UserManagerState;
};
const AppTopBar: FunctionComponent<AppTopBarProps> = (props) => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);

    const [themeLocal, handleChangeTheme] = useAppParameterState(PARAM_THEME);

    const [languageLocal, handleChangeLanguage] = useAppParameterState(PARAM_LANGUAGE);

    const [showParameters, setShowParameters] = useState(false);
    const hideParameters = useCallback(() => setShowParameters(false), []);

    useEffect(() => {
        if (props.user !== null) {
            fetchAppsMetadata().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [props.user]);

    return (
        <>
            <TopBar
                appName={APP_NAME}
                appColor="grey"
                appLogo={
                    themeLocal === LIGHT_THEME ? (
                        <PowsyblLogo /> //GridXXXLogoLight
                    ) : (
                        <PowsyblLogo /> //GridXXXLogoDark
                    )
                }
                appVersion={AppPackage.version}
                appLicense={AppPackage.license}
                onLogoutClick={() => logout(dispatch, props.userManager.instance)}
                onLogoClick={() => navigate('/', { replace: true })}
                user={props.user ?? undefined}
                appsAndUrls={appsAndUrls}
                globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion ?? 'unknown')}
                additionalModulesPromise={getServersInfos}
                onThemeClick={handleChangeTheme}
                theme={themeLocal}
                onLanguageClick={handleChangeLanguage}
                language={languageLocal}
            />
            <Parameters showParameters={showParameters} hideParameters={hideParameters} />
        </>
    );
};
export default AppTopBar;
