/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProcessExecution } from '../models/ProcessExecution';
import type { ProcessExecutionStep } from '../models/ProcessExecutionStep';
import type { ReportPage } from '../models/ReportPage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MonitorServerService {
    /**
     * Execute a process
     * @param caseUuid Case uuid
     * @param processConfigUuid Process config uuid
     * @param userId
     * @param isDebug
     * @returns string The process execution has been started
     * @throws ApiError
     */
    public static executeProcess(
        caseUuid: string,
        processConfigUuid: string,
        userId: string,
        isDebug: boolean = false,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/execute',
            headers: {
                'userId': userId,
            },
            query: {
                'caseUuid': caseUuid,
                'processConfigUuid': processConfigUuid,
                'isDebug': isDebug,
            },
            errors: {
                404: `Process config was not found`,
            },
        });
    }
    /**
     * Get launched processes
     * @param processType Process type
     * @returns ProcessExecution The launched processes
     * @throws ApiError
     */
    public static getLaunchedProcesses(
        processType: 'SECURITY_ANALYSIS',
    ): CancelablePromise<Array<ProcessExecution>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/executions',
            query: {
                'processType': processType,
            },
        });
    }
    /**
     * Get execution steps statuses
     * @param executionId Execution UUID
     * @returns ProcessExecutionStep The execution steps statuses
     * @throws ApiError
     */
    public static getStepsInfos(
        executionId: string,
    ): CancelablePromise<Array<ProcessExecutionStep>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/executions/{executionId}/step-infos',
            path: {
                'executionId': executionId,
            },
            errors: {
                404: `execution id was not found`,
            },
        });
    }
    /**
     * Get results for an execution
     * @param executionId Execution UUID
     * @returns string The execution results
     * @throws ApiError
     */
    public static getExecutionResults(
        executionId: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/executions/{executionId}/results',
            path: {
                'executionId': executionId,
            },
        });
    }
    /**
     * Get reports for an execution
     * @param executionId Execution UUID
     * @returns ReportPage The execution reports
     * @throws ApiError
     */
    public static getExecutionReports(
        executionId: string,
    ): CancelablePromise<Array<ReportPage>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/executions/{executionId}/reports',
            path: {
                'executionId': executionId,
            },
        });
    }
    /**
     * Get execution debug file
     * @param executionId Execution UUID
     * @returns string Debug file downloaded
     * @throws ApiError
     */
    public static getDebugInfos(
        executionId: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/executions/{executionId}/debug-infos',
            path: {
                'executionId': executionId,
            },
            errors: {
                404: `execution id was not found`,
            },
        });
    }
    /**
     * Delete an execution
     * @param executionId
     * @returns any Execution was deleted
     * @throws ApiError
     */
    public static deleteExecution(
        executionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/executions/{executionId}',
            path: {
                'executionId': executionId,
            },
            errors: {
                404: `Execution was not found`,
            },
        });
    }
}
