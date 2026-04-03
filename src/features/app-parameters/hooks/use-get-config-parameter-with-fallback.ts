import { useGetConfigParameterQuery } from 'shared/api/config-api/config-api';
import { initialAppParametersState } from '../store/app-parameters.default';
import { AppParameters, AppParametersKey } from '../store/app-parameters.type';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'features/authentication/store/authentication.selectors';
import { AppState } from 'app/store/store.type';

/**
 * This data is fetched from AppTopBar, which is displayed before user is authenticated
 * If user is not authenticated, or before the fetch request has responded, we use data from initialAppParametersState
 */
export const useGetConfigParameterWithFallback = <K extends AppParametersKey>(paramName: K) => {
    const user = useSelector((state: AppState) => selectAuthentication(state).user);
    return useGetConfigParameterQuery(paramName, {
        skip: !user,
        selectFromResult: (result) => {
            const data = result.data?.value ?? initialAppParametersState[paramName];

            return {
                ...result,
                data: data as AppParameters[K],
            };
        },
    });
};
