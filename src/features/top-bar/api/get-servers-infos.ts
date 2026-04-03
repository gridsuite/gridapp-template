import { GridSuiteModule } from '@gridsuite/commons-ui';
import { store } from 'app/store/store';
import { studyApi } from 'shared/api/study-api/study-api';
import { getErrorMessage } from 'shared/lib/error';

// hook to transform rtk query hooks to Promise in order to make legacy components work
export const getServersInfos = (): Promise<GridSuiteModule[]> => {
    const promise = store.dispatch(
        studyApi.endpoints.getAboutInfos.initiate(undefined, {
            forceRefetch: true,
        })
    );

    const result = promise.unwrap();

    result
        .catch((error) => {
            console.error(`Error while fetching the servers infos : ${getErrorMessage(error)}`);
            throw error;
        })
        .finally(() => {
            promise.unsubscribe();
        });

    return result;
};
