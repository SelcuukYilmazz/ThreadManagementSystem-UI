import { renderHook, act } from '@testing-library/react';
import { useThreadManagement } from './useThreadManagement';

// Mock fetch globally
global.fetch = jest.fn();

describe('useThreadManagement', () => {
    // Setup mock response data
    const mockSenderThreads = [{ id: 1, type: 'SENDER' }];
    const mockReceiverThreads = [{ id: 1, type: 'RECEIVER' }];
    const mockQueueMessages = {
        content: [{ id: 1, message: 'test' }],
        totalPages: 5
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes with default values', () => {
        const { result } = renderHook(() => useThreadManagement());

        expect(result.current.senderThreads).toEqual([]);
        expect(result.current.receiverThreads).toEqual([]);
        expect(result.current.error).toBeNull();
        expect(result.current.currentPage).toBe(0);
        expect(result.current.pageSize).toBe(14);
    });

    test('fetches initial data successfully', async () => {
        // Mock successful responses
        global.fetch.mockImplementation((url) => {
            if (url.includes('senderThreads')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockSenderThreads)
                });
            } else if (url.includes('receiverThreads')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockReceiverThreads)
                });
            } else if (url.includes('messageQueue')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockQueueMessages)
                });
            }
        });

        const { result } = renderHook(() => useThreadManagement());

        // Wait for the effect to run
        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.senderThreads).toEqual(mockSenderThreads);
        expect(result.current.receiverThreads).toEqual(mockReceiverThreads);
        expect(result.current.queueMessages).toEqual(mockQueueMessages.content);
    });

    test('handles fetch error correctly', async () => {
        // Mock failed response
        global.fetch.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useThreadManagement());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.error).toBe('Failed to fetch data. Please check if the backend server is running.');
    });

    test('creates threads successfully', async () => {
        global.fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            })
        );

        const { result } = renderHook(() => useThreadManagement());

        await act(async () => {
            await result.current.createThreads(2, 2);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            '/senderThreads/createSenderThreadsWithAmount?senderAmount=2',
            expect.any(Object)
        );
        expect(global.fetch).toHaveBeenCalledWith(
            '/receiverThreads/createReceiverThreadsWithAmount?receiverAmount=2',
            expect.any(Object)
        );
    });

    test('updates thread state successfully', async () => {
        global.fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            })
        );

        const { result } = renderHook(() => useThreadManagement());
        const mockThread = { id: '123', type: 'SENDER' };
        const newState = 'RUNNING';

        await act(async () => {
            await result.current.updateThreadState(mockThread, newState);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            `/senderThreads/${mockThread.id}/updateSenderThreadState?id=${mockThread.id}&threadState=${newState}`,
            expect.any(Object)
        );
    });

    test('updates thread priority successfully', async () => {
        global.fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            })
        );

        const { result } = renderHook(() => useThreadManagement());
        const mockThread = { id: '123', type: 'RECEIVER' };
        const newPriority = 5;

        await act(async () => {
            await result.current.updateThreadPriority(mockThread, newPriority);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            `/receiverThreads/${mockThread.id}/updateReceiverThreadPriority?id=${mockThread.id}&priority=${newPriority}`,
            expect.any(Object)
        );
    });

    test('deletes thread successfully', async () => {
        global.fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            })
        );

        const { result } = renderHook(() => useThreadManagement());
        const mockThread = { id: '123', type: 'SENDER' };

        await act(async () => {
            await result.current.deleteThread(mockThread);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            `/senderThreads/deleteSenderThreadById?id=${mockThread.id}`,
            expect.any(Object)
        );
    });

    test('deletes all threads successfully', async () => {
        global.fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            })
        );

        const { result } = renderHook(() => useThreadManagement());

        await act(async () => {
            await result.current.deleteAllThreads('SENDER');
        });

        expect(global.fetch).toHaveBeenCalledWith(
            '/senderThreads/deleteAllSenderThreads',
            expect.any(Object)
        );
    });

    test('starts polling on mount and cleans up on unmount', () => {
        const { unmount } = renderHook(() => useThreadManagement());

        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);

        unmount();

        expect(clearInterval).toHaveBeenCalled();
    });

    test('handles page changes correctly', async () => {
        const { result } = renderHook(() => useThreadManagement());

        await act(async () => {
            result.current.setCurrentPage(2);
        });

        expect(result.current.currentPage).toBe(2);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('page=2'),
            expect.any(Object)
        );
    });
});