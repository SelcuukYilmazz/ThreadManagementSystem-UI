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

    test('should render section title with thread count', () => {
        render(<ThreadSection {...defaultProps} />);

        expect(screen.getByText('Sender Threads (2)')).toBeInTheDocument();
    });

    test('should render delete all button with correct text', () => {
        render(<ThreadSection {...defaultProps} />);

        const deleteButton = screen.getByText('Delete All Sender Threads');
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass(
            'text-red-600',
            'hover:text-red-700',
            'hover:bg-red-50'
        );
    });

    test('should call onDeleteAll when delete all button is clicked', () => {
        render(<ThreadSection {...defaultProps} />);

        const deleteButton = screen.getByText('Delete All Sender Threads');
        fireEvent.click(deleteButton);

        expect(defaultProps.onDeleteAll).toHaveBeenCalledTimes(1);
    });


    test('should render correctly with empty threads array', () => {
        render(<ThreadSection {...defaultProps} threads={[]} />);

        expect(screen.getByText('Sender Threads (0)')).toBeInTheDocument();
        expect(screen.queryByTestId('thread-card')).not.toBeInTheDocument();
    });

    test('should handle different title props correctly', () => {
        const { rerender } = render(<ThreadSection {...defaultProps} />);
        expect(screen.getByText('Sender Threads (2)')).toBeInTheDocument();

        rerender(<ThreadSection {...defaultProps} title="Receiver Threads" />);
        expect(screen.getByText('Receiver Threads (2)')).toBeInTheDocument();
    });

    test('should update when threads prop changes', () => {
        const { rerender } = render(<ThreadSection {...defaultProps} />);
        expect(screen.getByText('Sender Threads (2)')).toBeInTheDocument();

        const newThreads = [...mockThreads, { id: '3', state: 'RUNNING', priority: 1 }];
        rerender(<ThreadSection {...defaultProps} threads={newThreads} />);
        expect(screen.getByText('Sender Threads (3)')).toBeInTheDocument();
    });
});