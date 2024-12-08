export const ThreadCountSelector = ({ senderCount, receiverCount, setSenderCount, setReceiverCount }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
            <label className="block text-sm font-medium mb-1">Sender Count</label>
            <select
                className="w-full p-2 border rounded-md"
                value={senderCount}
                onChange={(e) => setSenderCount(Number(e.target.value))}
            >
                {Array.from({length: 7}, (v, i) => 5 * i).map(num => (
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
                {Array.from({length: 7}, (v, i) => 5 * i).map(num => (
                    <option key={num} value={num}>{num} Threads</option>
                ))}
            </select>
        </div>
    </div>
);