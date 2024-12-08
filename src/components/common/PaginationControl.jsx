export const PaginationControl = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-between items-center mt-4 p-4 border-t">
        <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">
            Previous
        </button>
        <span>
      Page {currentPage + 1} of {totalPages}
    </span>
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">
            Next
        </button>
    </div>
);