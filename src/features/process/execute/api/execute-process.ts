import { backendFetch } from '@/shared/api/http';
import { ExecuteProcessParams, ExecuteProcessResponse } from '../types/execute-process.types';

function getFallbackExecutionId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `execution-${Date.now()}`;
}

export async function executeProcess(params: ExecuteProcessParams): Promise<ExecuteProcessResponse> {
    const searchParams = new URLSearchParams({
        caseUuid: params.caseUuid,
        isDebug: String(params.isDebug),
    });

    const response = await backendFetch(`/api/monitor/v1/execute/security-analysis?${searchParams.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', userId: params.userId },
        body: JSON.stringify({
            processType: 'SECURITY_ANALYSIS',
            parametersUuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            contingencies: ['ZBARTL33ZBEYR', 'WARANL71WEPPE'],
            modificationUuids: ['637053c1-2a6a-4f76-b6e1-22d70f7caff9'],
        }),
    });

    let executionId = getFallbackExecutionId();

    try {
        const data = await response.json();
        if (typeof data?.executionId === 'string') {
            executionId = data.executionId;
        } else if (typeof data?.id === 'string') {
            executionId = data.id;
        }
    } catch (_error) {
        // Keep the fallback execution id for this POC when the API does not return JSON.
    }

    return { executionId };
}
