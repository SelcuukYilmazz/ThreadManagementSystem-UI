import { Button } from '../../common/Button';
import {ThreadCard} from "./ThreadCard";

export const ThreadSection = ({
                                  title,
                                  threads,
                                  onUpdateState,
                                  onUpdatePriority,
                                  onDelete,
                                  onDeleteAll
                              }) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title} ({threads.length})</h2>
            <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onDeleteAll}
            >
                Delete All {title}
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {threads.map((thread) => (
                <ThreadCard
                    key={thread.id}
                    thread={thread}
                    onUpdateState={onUpdateState}
                    onUpdatePriority={onUpdatePriority}
                    onDelete={onDelete}
                />
            ))}
        </div>
    </div>
);