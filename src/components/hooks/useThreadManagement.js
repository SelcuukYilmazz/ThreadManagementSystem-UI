import { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const WEBSOCKET_URL = 'http://localhost:8080/ws';
const DEFAULT_PAGE_SIZE = 14;
const POLLING_INTERVAL = 5000;

/**
 * Custom hook for managing threads and messages with WebSocket support
 * @returns {Object} Thread management state and functions
 */
export const useThreadManagement = () => {
    // Thread States
    const [senderThreads, setSenderThreads] = useState([]);
    const [receiverThreads, setReceiverThreads] = useState([]);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Message Queue States
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(DEFAULT_PAGE_SIZE);

    // WebSocket Refs
    const stompClientRef = useRef(null);
    const sessionIdRef = useRef(crypto.randomUUID());
    const pollIntervalRef = useRef(null);

    /**
     * Fetches messages via HTTP
     */
    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(
                `/messageQueue/getMessageQueue?page=${currentPage}&size=${pageSize}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(data.content);
            setTotalPages(data.totalPages);
            setError(null);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to fetch messages. Please try again.');
        }
    }, [currentPage, pageSize]);

    /**
     * Fetches thread information via HTTP
     */
    const fetchThreads = useCallback(async () => {
        try {
            const [senderResponse, receiverResponse] = await Promise.all([
                fetch('/senderThreads/getAllSenderThreads'),
                fetch('/receiverThreads/getAllReceiverThreads')
            ]);

            if (!senderResponse.ok || !receiverResponse.ok) {
                throw new Error('Failed to fetch threads');
            }

            const [senderData, receiverData] = await Promise.all([
                senderResponse.json(),
                receiverResponse.json()
            ]);

            setSenderThreads(senderData);
            setReceiverThreads(receiverData);
            setError(null);
        } catch (err) {
            console.error('Error fetching threads:', err);
            setError('Failed to fetch threads. Please try again.');
        }
    }, []);

    /**
     * Starts polling for updates when WebSocket is not available
     */
    const startPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }

        pollIntervalRef.current = setInterval(() => {
            fetchMessages();
            fetchThreads();
        }, POLLING_INTERVAL);
    }, [fetchMessages, fetchThreads]);

    /**
     * Stops polling
     */
    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    }, []);

    /**
     * Establishes WebSocket connection
     */
    const connectWebSocket = useCallback(() => {
        const socket = new SockJS(WEBSOCKET_URL);
        const stomp = Stomp.over(socket);

        // Disable debug logging
        stomp.debug = () => {};

        stomp.connect({},
            // Success callback
            () => {
                setIsConnected(true);
                stompClientRef.current = stomp;
                stopPolling();

                // Subscribe to all necessary topics
                stomp.subscribe('/topic/senderThreads', (message) => {
                    const senderData = JSON.parse(message.body);
                    setSenderThreads(senderData);
                });

                stomp.subscribe('/topic/receiverThreads', (message) => {
                    const receiverData = JSON.parse(message.body);
                    setReceiverThreads(receiverData);
                });

                stomp.subscribe(`/topic/messageQueue`, (message) => {  // Changed from /user/topic/messageQueue
                    try {
                        const messageData = JSON.parse(message.body);
                        setMessages(messageData.content || []);
                        setTotalPages(messageData.totalPages || 0);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                stomp.subscribe(`/user/topic/messageQueue`, (message) => {
                    const queueData = JSON.parse(message.body);
                    setMessages(queueData.content);
                    setTotalPages(queueData.totalPages);
                });

                // Initialize subscriptions
                stomp.send('/messageQueue/subscribe', {},
                    JSON.stringify({
                        sessionId: sessionIdRef.current,
                        page: currentPage,
                        size: pageSize
                    })
                );

                // Request initial data
                stomp.send('/senderThreads/sendSenderThreads', {}, JSON.stringify({}));
                stomp.send('/receiverThreads/sendReceiverThreads', {}, JSON.stringify({}));
                stomp.send('/messageQueue/sendMessageQueue', {},
                    JSON.stringify({
                        page: currentPage,
                        size: pageSize
                    })
                );

                setError(null);
                setIsLoading(false);
            },
            // Error callback
            (err) => {
                console.error('WebSocket connection error:', err);
                setError('WebSocket connection failed. Falling back to HTTP polling.');
                setIsConnected(false);
                setIsLoading(false);
                startPolling();
            }
        );

        return stomp;
    }, [currentPage, pageSize, startPolling, stopPolling]);

    /**
     * Creates new threads
     */
    const createThreads = async (senderCount, receiverCount) => {
        try {
            setIsLoading(true);
            const [senderResponse, receiverResponse] = await Promise.all([
                fetch(`/senderThreads/createSenderThreadsWithAmount?senderAmount=${senderCount}`, {
                    method: 'POST',
                }),
                fetch(`/receiverThreads/createReceiverThreadsWithAmount?receiverAmount=${receiverCount}`, {
                    method: 'POST',
                })
            ]);

            if (!senderResponse.ok || !receiverResponse.ok) {
                throw new Error('Failed to create threads');
            }

            if (stompClientRef.current?.connected) {
                stompClientRef.current.send('/senderThreads/sendSenderThreads', {}, JSON.stringify({}));
                stompClientRef.current.send('/receiverThreads/sendReceiverThreads', {}, JSON.stringify({}));
            } else {
                await fetchThreads();
            }

            setError(null);
        } catch (err) {
            console.error('Error creating threads:', err);
            setError('Failed to create threads. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Updates thread state
     */
    const updateThreadState = async (thread, newState) => {
        const baseUrl = thread.type === 'SENDER' ? 'senderThreads' : 'receiverThreads';
        const endpoint = thread.type === 'SENDER' ? 'updateSenderThreadState' : 'updateReceiverThreadState';

        try {
            setIsLoading(true);
            const response = await fetch(
                `/${baseUrl}/${thread.id}/${endpoint}?id=${thread.id}&threadState=${newState}`,
                { method: 'PUT' }
            );

            if (!response.ok) {
                throw new Error('Failed to update thread state');
            }

            if (stompClientRef.current?.connected) {
                stompClientRef.current.send('/senderThreads/sendSenderThreads', {}, JSON.stringify({}));
                stompClientRef.current.send('/receiverThreads/sendReceiverThreads', {}, JSON.stringify({}));
            } else {
                await fetchThreads();
            }

            setError(null);
        } catch (err) {
            console.error('Error updating thread state:', err);
            setError('Failed to update thread state. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Updates thread priority
     */
    const updateThreadPriority = async (thread, newPriority) => {
        const baseUrl = thread.type === 'SENDER' ? 'senderThreads' : 'receiverThreads';
        const endpoint = thread.type === 'SENDER' ? 'updateSenderThreadPriority' : 'updateReceiverThreadPriority';

        try {
            setIsLoading(true);
            const response = await fetch(
                `/${baseUrl}/${thread.id}/${endpoint}?id=${thread.id}&priority=${newPriority}`,
                { method: 'PUT' }
            );

            if (!response.ok) {
                throw new Error('Failed to update thread priority');
            }

            if (stompClientRef.current?.connected) {
                stompClientRef.current.send('/senderThreads/sendSenderThreads', {}, JSON.stringify({}));
                stompClientRef.current.send('/receiverThreads/sendReceiverThreads', {}, JSON.stringify({}));
            } else {
                await fetchThreads();
            }

            setError(null);
        } catch (err) {
            console.error('Error updating thread priority:', err);
            setError('Failed to update thread priority. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Deletes a thread
     */
    const deleteThread = async (thread) => {
        const baseUrl = thread.type === 'SENDER' ? 'senderThreads' : 'receiverThreads';
        const endpoint = thread.type === 'SENDER' ? 'deleteSenderThreadById' : 'deleteReceiverThreadById';

        try {
            setIsLoading(true);
            const response = await fetch(
                `/${baseUrl}/${endpoint}?id=${thread.id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                throw new Error('Failed to delete thread');
            }

            if (stompClientRef.current?.connected) {
                stompClientRef.current.send('/senderThreads/sendSenderThreads', {}, JSON.stringify({}));
                stompClientRef.current.send('/receiverThreads/sendReceiverThreads', {}, JSON.stringify({}));
            } else {
                await fetchThreads();
            }

            setError(null);
        } catch (err) {
            console.error('Error deleting thread:', err);
            setError('Failed to delete thread. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Deletes all threads of a specific type
     */
    const deleteAllThreads = async (type) => {
        const endpoint = type === 'SENDER'
            ? '/senderThreads/deleteAllSenderThreads'
            : '/receiverThreads/deleteAllReceiverThreads';

        try {
            setIsLoading(true);
            const response = await fetch(endpoint, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`Failed to delete ${type.toLowerCase()} threads`);
            }

            if (stompClientRef.current?.connected) {
                stompClientRef.current.send('/senderThreads/sendSenderThreads', {}, JSON.stringify({}));
                stompClientRef.current.send('/receiverThreads/sendReceiverThreads', {}, JSON.stringify({}));
            } else {
                await fetchThreads();
            }

            setError(null);
        } catch (err) {
            console.error(`Error deleting ${type.toLowerCase()} threads:`, err);
            setError(`Failed to delete ${type.toLowerCase()} threads. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles page changes
     */
    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);

        if (stompClientRef.current?.connected) {
            stompClientRef.current.send('/messageQueue/updatePage', {},
                JSON.stringify({
                    sessionId: sessionIdRef.current,
                    page: newPage
                })
            );
        } else {
            fetchMessages();
        }
    }, [fetchMessages]);

    // Initialize thread lifecycles
    useEffect(() => {
        const startThreadLifecycles = async () => {
            try {
                setIsLoading(true);
                await Promise.all([
                    fetch('/senderThreads/startSenderThreadsLifeCycle'),
                    fetch('/receiverThreads/startReceiverThreadsLifeCycle')
                ]);
                await Promise.all([fetchMessages(), fetchThreads()]);
                setError(null);
            } catch (err) {
                console.error('Error starting thread lifecycles:', err);
                setError('Failed to start thread lifecycles.');
            } finally {
                setIsLoading(false);
            }
        };

        startThreadLifecycles();
    }, [fetchMessages, fetchThreads]);

    // Set up WebSocket connection and polling fallback
    useEffect(() => {
        const stomp = connectWebSocket();

        return () => {
            if (stomp?.connected) {
                stomp.send('/messageQueue/unsubscribe', {},
                    JSON.stringify({ sessionId: sessionIdRef.current })
                );
                stomp.disconnect();
            }
            stopPolling();
            setIsConnected(false);
        };
    }, [connectWebSocket, stopPolling]);

    return {
        // States
        senderThreads,
        receiverThreads,
        messages,
        error,
        isConnected,
        isLoading,
        currentPage,
        totalPages,
        pageSize,

        // Actions
        setCurrentPage: handlePageChange,
        createThreads,
        updateThreadState,
        updateThreadPriority,
        deleteThread,
        deleteAllThreads,
    };
};