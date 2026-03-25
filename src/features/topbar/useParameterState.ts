/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { RootState } from '@/app/store';
import { updateConfigParameter } from '@/shared/api/config';
import { AppStateKey, SettingsState } from '../settings/model/types';

export function useParameterState<K extends AppStateKey>(
    paramName: K
): [SettingsState[K], (value: SettingsState[K]) => void] {
    const { snackError } = useSnackMessage();
    const paramGlobalState = useSelector((state: RootState) => state.settings[paramName]);
    const [paramLocalState, setParamLocalState] = useState(paramGlobalState);

    useEffect(() => {
        setParamLocalState(paramGlobalState);
    }, [paramGlobalState]);

    const handleChangeParamLocalState = useCallback(
        (value: SettingsState[K]) => {
            setParamLocalState(value);
            updateConfigParameter(paramName, value as string).catch((error) => {
                setParamLocalState(paramGlobalState);
                snackError({
                    messageTxt: error.message,
                    headerId: 'paramsChangingError',
                });
            });
        },
        [paramName, snackError, paramGlobalState]
    );

    return [paramLocalState, handleChangeParamLocalState];
}
