import { render, screen, fireEvent } from '@testing-library/react';
import { ThreadSection } from './ThreadSection';
import { ThreadCard } from './ThreadCard';
import '@testing-library/jest-dom';

// Mock the ThreadCard component
jest.mock('./ThreadCard', () => ({
    ThreadCard: jest.fn(() => <div data-testid="thread-card" />)
}));

describe('ThreadSection', () => {
    const mockThreads = [
        { id: '1', state: 'RUNNING', priority: 5 },
        { id: '2', state: 'STOPPED', priority: 3 }
    ];

    const defaultProps = {
        title: 'Sender Threads',
        threads: mockThreads,
        onUpdateState: jest.fn(),
        onUpdatePriority: jest.fn(),
        onDelete: jest.fn(),
        onDeleteAll: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders section title with thread count', () => {
        render(<ThreadSection {...defaultProps} />);

        expect(screen.getByText('Sender Threads (2)')).toBeInTheDocument();
    });

    test('renders delete all button with correct text', () => {
        render(<ThreadSection {...defaultProps} />);

        const deleteButton = screen.getByText('Delete All Sender Threads');
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass(
            'text-red-600',
            'hover:text-red-700',
            'hover:bg-red-50'
        );
    });

    test('calls onDeleteAll when delete all button is clicked', () => {
        render(<ThreadSection {...defaultProps} />);

        const deleteButton = screen.getByText('Delete All Sender Threads');
        fireEvent.click(deleteButton);

        expect(defaultProps.onDeleteAll).toHaveBeenCalledTimes(1);
    });

    test('renders correct number of ThreadCard components', () => {
        render(<ThreadSection {...defaultProps} />);

        const threadCards = screen.getAllByTestId('thread-card');
        expect(threadCards).toHaveLength(mockThreads.length);
    });

    test('passes correct props to ThreadCard components', () => {
        render(<ThreadSection {...defaultProps} />);

        expect(ThreadCard).toHaveBeenCalledTimes(mockThreads.length);
        mockThreads.forEach((thread, index) => {
            expect(ThreadCard).toHaveBeenNthCalledWith(index + 1, {
                thread,
                onUpdateState: defaultProps.onUpdateState,
                onUpdatePriority: defaultProps.onUpdatePriority,
                onDelete: defaultProps.onDelete
            }, {});
        });
    });

    test('renders correctly with empty threads array', () => {
        render(<ThreadSection {...defaultProps} threads={[]} />);

        expect(screen.getByText('Sender Threads (0)')).toBeInTheDocument();
        expect(screen.queryByTestId('thread-card')).not.toBeInTheDocument();
    });

    test('applies correct grid classes', () => {
        render(<ThreadSection {...defaultProps} />);

        const grid = screen.getAllByTestId('thread-card')[0].parentElement;
        expect(grid).toHaveClass(
            'grid',
            'grid-cols-1',
            'md:grid-cols-2',
            'lg:grid-cols-3',
            'gap-4'
        );
    });

    test('applies correct header styles', () => {
        render(<ThreadSection {...defaultProps} />);

        const header = screen.getByText(/Sender Threads/).parentElement;
        expect(header).toHaveClass(
            'flex',
            'justify-between',
            'items-center',
            'mb-4'
        );
    });

    test('renders title heading with correct styles', () => {
        render(<ThreadSection {...defaultProps} />);

        const heading = screen.getByText(/Sender Threads/);
        expect(heading).toHaveClass('text-xl', 'font-semibold');
    });

    test('handles different title props correctly', () => {
        const { rerender } = render(<ThreadSection {...defaultProps} />);
        expect(screen.getByText('Sender Threads (2)')).toBeInTheDocument();

        rerender(<ThreadSection {...defaultProps} title="Receiver Threads" />);
        expect(screen.getByText('Receiver Threads (2)')).toBeInTheDocument();
    });

    test('updates when threads prop changes', () => {
        const { rerender } = render(<ThreadSection {...defaultProps} />);
        expect(screen.getByText('Sender Threads (2)')).toBeInTheDocument();

        const newThreads = [...mockThreads, { id: '3', state: 'RUNNING', priority: 1 }];
        rerender(<ThreadSection {...defaultProps} threads={newThreads} />);
        expect(screen.getByText('Sender Threads (3)')).toBeInTheDocument();
    });
});