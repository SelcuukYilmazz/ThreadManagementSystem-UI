import { ChevronLeft, ChevronRight } from 'lucide-react';
import {PaginationControl} from "../../common/PaginationControl";

export const QueuePanel = ({
                               isOpen,
                               onToggle,
                               messages,
                               currentPage,
                               totalPages,
                               onPageChange
                           }) => (
    <>
        <button
            onClick={onToggle}
            className={`fixed top-4 right-4 z-30 bg-white p-2 rounded-lg shadow-lg border ${
                isOpen ? 'right-[384px]' : 'right-4'
            }`}
        >
            {isOpen ? (
                <ChevronRight className="w-6 h-6" />
            ) : (
                <ChevronLeft className="w-6 h-6" />
            )}
        </button>
        <div
            className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-20 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
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
                        {messages.map((message, index) => (
                            <tr key={message.id || index} className="border-t">
                                <td className="px-4 py-2 text-sm">{message}</td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center px-4 py-2 text-gray-500">
                                    No messages in queue
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    </>
);