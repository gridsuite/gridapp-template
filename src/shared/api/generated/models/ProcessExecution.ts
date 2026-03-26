/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Process execution data
 */
export type ProcessExecution = {
    id?: string;
    type?: string;
    caseUuid?: string;
    processConfigId?: string;
    status?: ProcessExecution.status;
    executionEnvName?: string;
    scheduledAt?: string;
    startedAt?: string;
    completedAt?: string;
    userId?: string;
};
export namespace ProcessExecution {
    export enum status {
        SCHEDULED = 'SCHEDULED',
        RUNNING = 'RUNNING',
        COMPLETED = 'COMPLETED',
        FAILED = 'FAILED',
    }
}

