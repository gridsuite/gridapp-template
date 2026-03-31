import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

type ExecutionResultState = {
    currentExecutionId: string | null;
};

const initialState: ExecutionResultState = {
    currentExecutionId: null,
};

const executionResultSlice = createSlice({
    name: 'executionResult',
    initialState,
    reducers: {
        setCurrentExecutionId(state, action: PayloadAction<string>) {
            state.currentExecutionId = action.payload;
        },
    },
});

export const { setCurrentExecutionId } = executionResultSlice.actions;
export const selectCurrentExecutionId = (state: RootState) => state.executionResult.currentExecutionId;

export default executionResultSlice.reducer;
