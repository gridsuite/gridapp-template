import { ExecuteProcessParams } from '../types/execute-process.types';
import { MonitorServerService } from '@/shared/api/generated';

export async function executeProcess(params: ExecuteProcessParams): Promise<string> {
    return await MonitorServerService.executeProcess(
        params.caseUuid,
        params.parameterUuid,
        params.userId,
        params.isDebug
    );
}
