export type ExecuteProcessParams = {
    caseUuid: string;
    parameterUuid: string;
    isDebug: boolean;
    userId: string;
};

export type ExecuteProcessResponse = {
    executionId: string;
};
