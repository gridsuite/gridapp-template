import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Nettoie le DOM entre chaque test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
