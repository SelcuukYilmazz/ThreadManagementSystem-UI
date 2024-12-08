import { useState, useEffect } from 'react';

export const useThreadManagement = () => {
    const [senderThreads, setSenderThreads] = useState([]);
    const [receiverThreads, setReceiverThreads] = useState([]);
    const [error, setError] = useState(null);
    const [queueMessages, setQueueMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(14);

    const fetchInformations = async () => {
        try {
            const [sendersResponse, receiversResponse, messageQueueResponse] = await Promise.all([
                fetch('/senderThreads/getAllSenderThreads'),
                fetch('/receiverThreads/getAllReceiverThreads'),
                fetch(`/messageQueue/getMessageQueue?page=${currentPage}&size=${pageSize}`)
            ]);

            if (!sendersResponse.ok || !receiversResponse.ok || !messageQueueResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const [sendersData, receiversData, messageQueueData] = await Promise.all([
                sendersResponse.json(),
                receiversResponse.json(),
                messageQueueResponse.json()
            ]);

            setSenderThreads(sendersData);
            setReceiverThreads(receiversData);
            setQueueMessages(messageQueueData.content);
            setTotalPages(messageQueueData.totalPages);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please check if the backend server is running.');
        }
    };

    const createThreads = async (senderCount, receiverCount) => {
        try {
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

            await fetchInformations();
            setError(null);
        } catch (error) {
            console.error('Error creating threads:', error);
            setError('Failed to create threads. Please try again.');
        }
    };

    const updateThreadState = async (thread, newState) => {
        const baseUrl = thread.type === 'SENDER' ? 'senderThreads' : 'receiverThreads';
        const endpoint = thread.type === 'SENDER' ? 'updateSenderThreadState' : 'updateReceiverThreadState';

        try {
            const response = await fetch(`/${baseUrl}/${thread.id}/${endpoint}?id=${thread.id}&threadState=${newState}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error('Failed to update thread state');
            }

            await fetchInformations();
            setError(null);
        } catch (error) {
            console.error('Error updating thread state:', error);
            setError('Failed to update thread state. Please try again.');
        }
    };

    const updateThreadPriority = async (thread, newPriority) => {
        const baseUrl = thread.type === 'SENDER' ? 'senderThreads' : 'receiverThreads';
        const endpoint = thread.type === 'SENDER' ? 'updateSenderThreadPriority' : 'updateReceiverThreadPriority';

        try {
            const response = await fetch(`/${baseUrl}/${thread.id}/${endpoint}?id=${thread.id}&priority=${newPriority}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error('Failed to update thread priority');
            }

            await fetchInformations();
            setError(null);
        } catch (error) {
            console.error('Error updating thread priority:', error);
            setError('Failed to update thread priority. Please try again.');
        }
    };

    const deleteThread = async (thread) => {
        const baseUrl = thread.type === 'SENDER' ? 'senderThreads' : 'receiverThreads';
        const endpoint = thread.type === 'SENDER' ? 'deleteSenderThreadById' : 'deleteReceiverThreadById';

        try {
            const response = await fetch(`/${baseUrl}/${endpoint}?id=${thread.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete thread');
            }

            await fetchInformations();
            setError(null);
        } catch (error) {
            console.error('Error deleting thread:', error);
            setError('Failed to delete thread. Please try again.');
        }
    };

    const deleteAllThreads = async (type) => {
        const endpoint = type === 'SENDER' ?
            '/senderThreads/deleteAllSenderThreads' :
            '/receiverThreads/deleteAllReceiverThreads';

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete ${type.toLowerCase()} threads`);
            }

            await fetchInformations();
            setError(null);
        } catch (error) {
            console.error(`Error deleting ${type.toLowerCase()} threads:`, error);
            setError(`Failed to delete ${type.toLowerCase()} threads. Please try again.`);
        }
    };

    useEffect(() => {
        const startThreadLifecycles = async () => {
            try {
                await Promise.all([
                    fetch('/senderThreads/startSenderThreadsLifeCycle'),
                    fetch('/receiverThreads/startReceiverThreadsLifeCycle')
                ]);
            } catch (error) {
                console.error('Error starting thread lifecycles:', error);
                setError('Failed to start thread lifecycles.');
            }
        };

        startThreadLifecycles();
    }, []);

    useEffect(() => {
        fetchInformations();
        const interval = setInterval(fetchInformations, 1000);
        return () => clearInterval(interval);
    }, [currentPage, pageSize]);

    return {
        senderThreads,
        receiverThreads,
        error,
        queueMessages,
        currentPage,
        totalPages,
        pageSize,
        setCurrentPage,
        fetchInformations,
        createThreads,
        updateThreadState,
        updateThreadPriority,
        deleteThread,
        deleteAllThreads
    };
};