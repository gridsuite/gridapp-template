/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersistedProcessConfig } from '../models/PersistedProcessConfig';
import type { ProcessConfigComparison } from '../models/ProcessConfigComparison';
import type { SecurityAnalysisConfig } from '../models/SecurityAnalysisConfig';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProcessConfigService {
    /**
     * Get process config
     * @param uuid process config UUID
     * @returns PersistedProcessConfig process config was returned
     * @throws ApiError
     */
    public static getProcessConfig(
        uuid: string,
    ): CancelablePromise<PersistedProcessConfig> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/process-configs/{uuid}',
            path: {
                'uuid': uuid,
            },
            errors: {
                404: `process config was not found`,
            },
        });
    }
    /**
     * Update process config
     * @param uuid process config UUID
     * @param requestBody
     * @returns any process config was updated
     * @throws ApiError
     */
    public static updateProcessConfig(
        uuid: string,
        requestBody: SecurityAnalysisConfig,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/process-configs/{uuid}',
            path: {
                'uuid': uuid,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `process config was not found`,
            },
        });
    }
    /**
     * Delete process config
     * @param uuid process config UUID
     * @returns any process config was deleted
     * @throws ApiError
     */
    public static deleteProcessConfig(
        uuid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/process-configs/{uuid}',
            path: {
                'uuid': uuid,
            },
            errors: {
                404: `process config was not found`,
            },
        });
    }
    /**
     * Get all process configs of a given type
     * @param processType Process type
     * @returns PersistedProcessConfig The process configs of the given type were returned
     * @throws ApiError
     */
    public static getProcessConfigs(
        processType: 'SECURITY_ANALYSIS',
    ): CancelablePromise<Array<PersistedProcessConfig>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/process-configs',
            query: {
                'processType': processType,
            },
        });
    }
    /**
     * Create process config
     * @param requestBody
     * @returns string process config was created
     * @throws ApiError
     */
    public static createProcessConfig(
        requestBody: SecurityAnalysisConfig,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/process-configs',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Compare 2 process configs
     * @param uuid1 First process config UUID
     * @param uuid2 Second process config UUID
     * @returns ProcessConfigComparison Comparison result returned
     * @throws ApiError
     */
    public static compareProcessConfigs(
        uuid1: string,
        uuid2: string,
    ): CancelablePromise<ProcessConfigComparison> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/process-configs/compare',
            query: {
                'uuid1': uuid1,
                'uuid2': uuid2,
            },
            errors: {
                400: `Process configs are of different types`,
                404: `One or both process configs are not found`,
            },
        });
    }
}
