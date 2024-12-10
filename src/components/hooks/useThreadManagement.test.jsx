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
    let setIntervalSpy;
    let clearIntervalSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        setIntervalSpy = jest.spyOn(global, 'setInterval');
        clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    });

    afterEach(() => {
        jest.useRealTimers();
        setIntervalSpy.mockRestore();
        clearIntervalSpy.mockRestore();
    });

    test('should initialize with default values when mounted', () => {
        const { result } = renderHook(() => useThreadManagement());

        expect(result.current.senderThreads).toEqual([]);
        expect(result.current.receiverThreads).toEqual([]);
        expect(result.current.error).toBeNull();
        expect(result.current.currentPage).toBe(0);
        expect(result.current.pageSize).toBe(14);
    });

    test('should fetch initial data successfully when fetched', async () => {
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

    test('should handle fetch error correctly when fetch error thrown', async () => {
        // Mock failed response
        global.fetch.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useThreadManagement());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.error).toBe('Failed to fetch data. Please check if the backend server is running.');
    });

    test('should create threads successfully when create threads', async () => {
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

    test('should update thread state successfully when thread state updated', async () => {
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

    test('should update thread priority successfully when thread priority updated', async () => {
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

    test('should delete thread successfully when thread deleted', async () => {
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

    test('should delete all threads successfully when all threads deleted', async () => {
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

    test('should start polling on mount and clean up when unmount', () => {
        const { unmount } = renderHook(() => useThreadManagement());

        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);

        unmount();

        expect(clearInterval).toHaveBeenCalled();
    });
});