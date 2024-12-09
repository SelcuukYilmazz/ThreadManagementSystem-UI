import { render, screen, fireEvent } from '@testing-library/react';
import { ThreadCard } from './ThreadCard';
import { Play, Pause } from 'lucide-react';
import '@testing-library/jest-dom';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
    Play: () => <div data-testid="play-icon" />,
    Pause: () => <div data-testid="pause-icon" />
}));

describe('ThreadCard', () => {
    const mockThread = {
        id: 'test-123',
        state: 'RUNNING',
        priority: 5
    };

    const mockProps = {
        thread: mockThread,
        onUpdateState: jest.fn(),
        onUpdatePriority: jest.fn(),
        onDelete: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders thread details correctly', () => {
        render(<ThreadCard {...mockProps} />);

        expect(screen.getByText(mockThread.id)).toBeInTheDocument();
        expect(screen.getByText(mockThread.state)).toBeInTheDocument();
    });

    test('applies correct state badge styling for RUNNING state', () => {
        render(<ThreadCard {...mockProps} />);

        const stateBadge = screen.getByText('RUNNING');
        expect(stateBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    test('applies correct state badge styling for STOPPED state', () => {
        render(<ThreadCard {...mockProps} thread={{ ...mockThread, state: 'STOPPED' }} />);

        const stateBadge = screen.getByText('STOPPED');
        expect(stateBadge).toHaveClass('bg-red-100', 'text-red-800');
    });

    test('renders Run button with correct variant when thread is STOPPED', () => {
        render(<ThreadCard {...mockProps} thread={{ ...mockThread, state: 'STOPPED' }} />);

        const runButton = screen.getByText('Run').parentElement;
        expect(runButton).not.toHaveClass('outline');
        expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    });

    test('calls onUpdateState with RUNNING state when Run button clicked', () => {
        render(<ThreadCard {...mockProps} />);

        fireEvent.click(screen.getByText('Run'));
        expect(mockProps.onUpdateState).toHaveBeenCalledWith(mockThread, 'RUNNING');
    });

    test('calls onUpdateState with STOPPED state when Stop button clicked', () => {
        render(<ThreadCard {...mockProps} />);

        fireEvent.click(screen.getByText('Stop'));
        expect(mockProps.onUpdateState).toHaveBeenCalledWith(mockThread, 'STOPPED');
    });

    test('calls onDelete when Delete Thread button is clicked', () => {
        render(<ThreadCard {...mockProps} />);

        const deleteButton = screen.getByText('Delete Thread');
        fireEvent.click(deleteButton);

        expect(mockProps.onDelete).toHaveBeenCalledWith(mockThread);
    });

    test('applies correct styling to Delete Thread button', () => {
        render(<ThreadCard {...mockProps} />);

        const deleteButton = screen.getByText('Delete Thread');
        expect(deleteButton).toHaveClass(
            'w-full',
            'mt-4',
            'bg-red-600',
            'hover:bg-red-700',
            'text-white'
        );
    });

    test('renders priority label correctly', () => {
        render(<ThreadCard {...mockProps} />);

        const label = screen.getByText('Priority');
        expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'mb-1');
    });
});