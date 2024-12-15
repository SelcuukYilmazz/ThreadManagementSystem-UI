import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationControl } from "../../common/PaginationControl";

export const QueuePanel = ({
                               isOpen,
                               onToggle,
                               messages = [], // Default to empty array to prevent map errors
                               currentPage,
                               totalPages,
                               onPageChange,
                               isLoading = false // Add loading prop with default value
                           }) => (
    <>
        <button
            onClick={onToggle}
            className={`fixed top-4 z-30 bg-white p-2 rounded-lg shadow-lg border transition-all duration-300 ${
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
            }`}
        >
            <div className="p-4 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Queue Messages</h2>
                <div className="flex-1 overflow-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th className="text-left px-4 py-2 bg-gray-50 sticky top-0">Content</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(messages) && messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <tr key={message?.id || index} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm break-words">
                                            {typeof message === 'object' ? JSON.stringify(message) : message}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="text-center px-4 py-8 text-gray-500">
                                        No messages in queue
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
                {totalPages > 0 && (
                    <div>
                        <PaginationControl
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    </>
);