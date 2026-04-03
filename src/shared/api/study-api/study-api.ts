import { GridSuiteModule } from '@gridsuite/commons-ui';
import { baseApi } from '../base-api';

const STUDY_URL = `/study/v1`;

const makeStudyUrl = (path: string) => `${STUDY_URL}${path}`;

export const studyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAboutInfos: builder.query<GridSuiteModule[], void>({
            query: () => makeStudyUrl('/servers/about?view=yyy'),
        }),
    }),
});

export const { useGetAboutInfosQuery } = studyApi;
