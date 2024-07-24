/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from 'react';
import Parameters, { useParameterState } from './parameters';
import { APP_NAME } from '../utils/config-params';
import { useDispatch, useSelector } from 'react-redux';
import { appsMetadataSrv, studySrv } from '../services';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as PowsyblLogo } from '../images/powsybl_logo.svg';
import AppPackage from '../../package.json';
import { AppState } from '../redux/reducer';
import { AppDispatch } from '../redux/store';
import {
    AppMetadataCommon,
    LIGHT_THEME,
    logout,
    PARAM_LANGUAGE,
    PARAM_THEME,
    TopBar,
    UserManagerState,
} from '@gridsuite/commons-ui';

export type AppTopBarProps = {
    user?: AppState['user'];
    userManager: UserManagerState;
};
const AppTopBar: FunctionComponent<AppTopBarProps> = (props) => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    const [appsAndUrls, setAppsAndUrls] = useState<AppMetadataCommon[]>([]);

    const theme = useSelector((state: AppState) => state[PARAM_THEME]);

    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);

    const [languageLocal, handleChangeLanguage] =
        useParameterState(PARAM_LANGUAGE);

    const [showParameters, setShowParameters] = useState(false);
    const displayParameters = useCallback(() => setShowParameters(true), []);
    const hideParameters = useCallback(() => setShowParameters(false), []);
    const onLogoutClick = useCallback(
        () => logout(dispatch, props.userManager.instance),
        [dispatch, props.userManager.instance]
    );

    useEffect(() => {
        if (props.user !== undefined) {
            appsMetadataSrv.fetchAppsMetadata().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [props.user]);
    const globalVersionFetcher = useCallback(
        () =>
            appsMetadataSrv
                .fetchVersion()
                .then((res) => res?.deployVersion ?? 'unknown'),
        []
    );
    const additionalModulesFetcher = useCallback(
        () => studySrv.getServersInfos('yyy'),
        []
    );

    return (
        <>
            <TopBar
                appName={APP_NAME}
                appColor="grey"
                appLogo={
                    theme === LIGHT_THEME ? (
                        <PowsyblLogo /> //GridXXXLogoLight
                    ) : (
                        <PowsyblLogo /> //GridXXXLogoDark
                    )
                }
                appVersion={AppPackage.version}
                appLicense={AppPackage.license}
                onParametersClick={displayParameters}
                onLogoutClick={onLogoutClick}
                onLogoClick={() => navigate('/', { replace: true })}
                user={props.user}
                appsAndUrls={appsAndUrls}
                globalVersionPromise={globalVersionFetcher}
                additionalModulesPromise={additionalModulesFetcher}
                onThemeClick={handleChangeTheme}
                theme={themeLocal}
                onLanguageClick={handleChangeLanguage}
                language={languageLocal}
            />
            <Parameters
                showParameters={showParameters}
                hideParameters={hideParameters}
            />
        </>
    );
};
export default AppTopBar;
