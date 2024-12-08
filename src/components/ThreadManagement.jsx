import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { ThreadCard } from './ui/ThreadCard';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight} from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

const ThreadManagement = () => {
    const [senderThreads, setSenderThreads] = useState([]);
    const [receiverThreads, setReceiverThreads] = useState([]);
    const [senderCount, setSenderCount] = useState(5);
    const [receiverCount, setReceiverCount] = useState(5);
    const [error, setError] = useState(null);
    const [queueMessages, setQueueMessages] = useState([]);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(fetchInformations, 2500);
        return () => clearInterval(interval);
    }, []);
    useEffect(()=>
    {
        fetchInformations();
        const startSenderThreads = fetch('/senderThreads/startSenderThreadsLifeCycle');
        const startReceiverThreads = fetch('/receiverThreads/startReceiverThreadsLifeCycle');
    })

    const fetchInformations = async () => {
        try {
            const [sendersResponse, receiversResponse] = await Promise.all([
                fetch('/senderThreads/getAllSenderThreads'),
                fetch('/receiverThreads/getAllReceiverThreads')
            ]);

            const messageQueueResponse = await fetch('/messageQueue/getMessageQueue');
            const messageQueueData = await messageQueueResponse.json();

            if (!sendersResponse.ok || !receiversResponse.ok || !messageQueueResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const sendersData = await sendersResponse.json();
            const receiversData = await receiversResponse.json();

            setQueueMessages(messageQueueData);
            setSenderThreads(sendersData);
            setReceiverThreads(receiversData);
            setError(null);
        } catch (error) {
            console.error('Error fetching threads:', error);
            setError('Failed to fetch threads. Please check if the backend server is running.');
        }
    };

    const createThreads = async () => {
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

            fetchInformations();
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

            fetchInformations();
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

            fetchInformations();
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

            fetchInformations();
            setError(null);
        } catch (error) {
            console.error('Error deleting thread:', error);
            setError('Failed to delete thread. Please try again.');
        }
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Thread Management System</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Sender Count</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={senderCount}
                                onChange={(e) => setSenderCount(Number(e.target.value))}
                            >
                                {Array.from({length: 11}, (v, i) => 5 * i).map(num => (
                                    <option key={num} value={num}>{num} Threads</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Receiver Count</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={receiverCount}
                                onChange={(e) => setReceiverCount(Number(e.target.value))}
                            >
                                {Array.from({length: 11}, (v, i) => 5 * i).map(num => (
                                    <option key={num} value={num}>{num} Threads</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Button
                        onClick={createThreads}
                        className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Create Threads
                    </Button>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Sender Threads ({senderThreads.length})</h2>
                                <Button
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={async () => {
                                        try {
                                            const response = await fetch('/senderThreads/deleteAllSenderThreads', {method: 'DELETE'});
                                            if (!response.ok) throw new Error('Failed to delete sender threads');
                                            fetchInformations();
                                            setError(null);
                                        } catch (error) {
                                            setError('Failed to delete sender threads. Please try again.');
                                        }
                                    }}
                                >
                                    Delete All Sender Threads
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {senderThreads.map((thread) => (
                                    <ThreadCard
                                        key={thread.id}
                                        thread={thread}
                                        onUpdateState={updateThreadState}
                                        onUpdatePriority={updateThreadPriority}
                                        onDelete={deleteThread}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Receiver Threads ({receiverThreads.length})</h2>
                                <Button
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={async () => {
                                        try {
                                            const response = await fetch('/receiverThreads/deleteAllReceiverThreads', {method: 'DELETE'});
                                            if (!response.ok) throw new Error('Failed to delete receiver threads');
                                            fetchInformations();
                                            setError(null);
                                        } catch (error) {
                                            setError('Failed to delete receiver threads. Please try again.');
                                        }
                                    }}
                                >
                                    Delete All Receiver Threads
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {receiverThreads.map((thread) => (
                                    <ThreadCard
                                        key={thread.id}
                                        thread={thread}
                                        onUpdateState={updateThreadState}
                                        onUpdatePriority={updateThreadPriority}
                                        onDelete={deleteThread}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <button
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                className={`fixed top-4 right-4 z-30 bg-white p-2 rounded-lg shadow-lg border ${
                    isSidePanelOpen ? 'right-[384px]' : 'right-4'
                }`}
            >
                {isSidePanelOpen ? (
                    <ChevronRight className="w-6 h-6" />
                ) : (
                    <ChevronLeft className="w-6 h-6" />
                )}
            </button>
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-20 ${
                    isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4 h-full flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Queue Messages</h2>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th className="text-left px-4 py-2 bg-gray-50 sticky top-0">Content</th>
                            </tr>
                            </thead>
                            <tbody>
                            {queueMessages.map((message, index) => (
                                <tr key={message.id || index} className="border-t">
                                    <td className="px-4 py-2 text-sm">{message}</td>
                                </tr>
                            ))}
                            {queueMessages.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center px-4 py-2 text-gray-500">
                                        No messages in queue
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadManagement;