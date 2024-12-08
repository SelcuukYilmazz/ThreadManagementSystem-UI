import {Card, CardContent} from "./Card";
import {Button} from "./Button";
import {Pause, Play} from "lucide-react";

export function ThreadCard ({ thread, onUpdateState, onUpdatePriority, onDelete })
{
    return <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">{thread.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                        thread.state === 'RUNNING' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                    }`}>
          {thread.state}
        </span>
                </div>

                <div className="flex gap-2 mb-4">
                    <Button
                        size="sm"
                        variant={thread.state === 'RUNNING' ? 'outline' : 'default'}
                        onClick={() => onUpdateState(thread, 'RUNNING')}
                    >
                        <Play className="w-4 h-4" />
                        <span className="ml-2">Run</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onUpdateState(thread, 'STOPPED')}
                    >
                        <Pause className="w-4 h-4" />
                        <span className="ml-2">Stop</span>
                    </Button>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        value={thread.priority || 5}
                        onChange={(e) => onUpdatePriority(thread, parseInt(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
                            <option key={p} value={p}>Priority {p}</option>
                        ))}
                    </select>
                </div>
                <Button
                    onClick={() => onDelete(thread)}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                    Delete Thread
                </Button>
            </CardContent>
        </Card>


};