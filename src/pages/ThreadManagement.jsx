import { useState } from 'react';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ThreadManagementHeader } from '../components/ui/thread/ThreadManagementHeader';
import { ThreadCountSelector } from '../components/ui/thread/ThreadCountSelector';
import { ThreadSection } from '../components/ui/thread/ThreadSection';
import { QueuePanel } from '../components/ui/queue/QueuePanel';
import { useThreadManagement } from '../components/hooks/useThreadManagement';

const ThreadManagement = () => {
    const [senderCount, setSenderCount] = useState(5);
    const [receiverCount, setReceiverCount] = useState(5);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    const {
        senderThreads,
        receiverThreads,
        error,
        queueMessages,
        currentPage,
        totalPages,
        setCurrentPage,
        createThreads,
        updateThreadState,
        updateThreadPriority,
        deleteThread,
        deleteAllThreads
    } = useThreadManagement();

    const handleCreateThreads = () => {
        createThreads(senderCount, receiverCount);
    };

    const handleDeleteAllSenders = () => {
        deleteAllThreads('SENDER');
    };

    const handleDeleteAllReceivers = () => {
        deleteAllThreads('RECEIVER');
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <Card>
                <ThreadManagementHeader error={error} />
                <CardContent>
                    <ThreadCountSelector
                        senderCount={senderCount}
                        receiverCount={receiverCount}
                        setSenderCount={setSenderCount}
                        setReceiverCount={setReceiverCount}
                    />

                    <Button
                        onClick={handleCreateThreads}
                        className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Create Threads
                    </Button>

                    <div className="space-y-8">
                        <ThreadSection
                            title="Sender Threads"
                            threads={senderThreads}
                            onUpdateState={updateThreadState}
                            onUpdatePriority={updateThreadPriority}
                            onDelete={deleteThread}
                            onDeleteAll={handleDeleteAllSenders}
                        />

                        <ThreadSection
                            title="Receiver Threads"
                            threads={receiverThreads}
                            onUpdateState={updateThreadState}
                            onUpdatePriority={updateThreadPriority}
                            onDelete={deleteThread}
                            onDeleteAll={handleDeleteAllReceivers}
                        />
                    </div>
                </CardContent>
            </Card>

            <QueuePanel
                isOpen={isSidePanelOpen}
                onToggle={() => setIsSidePanelOpen(!isSidePanelOpen)}
                messages={queueMessages}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ThreadManagement;