/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useSnackMessage } from '@gridsuite/commons-ui';
import { AppParameters, AppParametersKey } from 'features/app-parameters/store/app-parameters.type';
import { useState, useEffect, useCallback } from 'react';
import { useUpdateConfigParameterMutation } from 'shared/api/config-api/config-api';
import { getErrorMessage } from 'shared/lib/error';
import { useGetConfigParameterWithFallback } from './use-get-config-parameter-with-fallback';

export function useAppParameterState<K extends AppParametersKey>(
    paramName: K
): [AppParameters[K], (value: AppParameters[K]) => void] {
    const { snackError } = useSnackMessage();
    const { data: paramValue } = useGetConfigParameterWithFallback(paramName);
    const [updateConfigParameter] = useUpdateConfigParameterMutation();

    // optimistic local value
    const [localValue, setLocalValue] = useState(paramValue);

    useEffect(() => {
        setLocalValue(paramValue);
    }, [paramValue]);

    const setValue = useCallback(
        async (newValue: AppParameters[K]) => {
            const previousValue = localValue;
            setLocalValue(newValue);
            try {
                await updateConfigParameter({
                    name: paramName,
                    value: newValue,
                }).unwrap();
            } catch (error) {
                setLocalValue(previousValue);

                snackError({
                    messageTxt: getErrorMessage(error) ?? undefined,
                    headerId: 'paramsChangingError',
                });
            }
        },
        [paramName, localValue, updateConfigParameter, snackError]
    );

    return [localValue, setValue];
}
