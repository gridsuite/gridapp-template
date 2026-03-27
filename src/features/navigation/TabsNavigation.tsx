import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { AppDispatch } from '@/app/store';
import { invalidateExecutionResultCache } from '@/features/process/result/api/execution-result-cache.api';
import {
    selectCurrentExecutionId,
    setCurrentExecutionId,
} from '@/features/process/result/store/execution-result.slice';

const TabsNavigation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentExecutionId = useSelector(selectCurrentExecutionId);

    return (
        <nav className="tabs-navigation" aria-label="Primary navigation">
            <div className="tabs-links">
                <NavLink
                    className={({ isActive }) => (isActive ? 'tabs-link tabs-link-active' : 'tabs-link')}
                    to="/execute"
                >
                    Execute
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? 'tabs-link tabs-link-active' : 'tabs-link')}
                    to="/raw"
                >
                    Raw JSON
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? 'tabs-link tabs-link-active' : 'tabs-link')}
                    to="/styled"
                >
                    Styled JSON
                </NavLink>
            </div>
            <input
                aria-label="Execution ID"
                className="tabs-execution-input"
                placeholder="Execution ID"
                type="text"
                value={currentExecutionId ?? ''}
                onChange={(event) => {
                    const value = event.target.value;

                    dispatch(setCurrentExecutionId(value));
                    dispatch(invalidateExecutionResultCache(value));
                }}
            />
        </nav>
    );
};

export default TabsNavigation;
