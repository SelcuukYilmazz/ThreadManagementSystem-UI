import { render, screen, fireEvent } from '@testing-library/react';
import { QueuePanel } from './QueuePanel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@testing-library/jest-dom';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
    ChevronLeft: () => <div data-testid="chevron-left" />,
    ChevronRight: () => <div data-testid="chevron-right" />
}));

describe('QueuePanel', () => {
    const defaultProps = {
        isOpen: false,
        onToggle: jest.fn(),
        messages: ['Message 1', 'Message 2'],
        currentPage: 0,
        totalPages: 5,
        onPageChange: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders with all elements when closed', () => {
        render(<QueuePanel {...defaultProps} />);

        // Toggle button should be at right-4
        const toggleButton = screen.getByRole('button');
        expect(toggleButton).toHaveClass('right-4');

        // Should show left chevron when closed
        expect(screen.getByTestId('chevron-left')).toBeInTheDocument();

        // Panel should be translated out
        const panel = screen.getByText('Queue Messages').parentElement?.parentElement;
        expect(panel).toHaveClass('translate-x-full');
    });

    test('renders with all elements when open', () => {
        render(<QueuePanel {...defaultProps} isOpen={true} />);

        // Toggle button should be at right-[384px]
        const toggleButton = screen.getByRole('button');
        expect(toggleButton).toHaveClass('right-[384px]');

        // Should show right chevron when open
        expect(screen.getByTestId('chevron-right')).toBeInTheDocument();

        // Panel should not be translated
        const panel = screen.getByText('Queue Messages').parentElement?.parentElement;
        expect(panel).toHaveClass('translate-x-0');
    });

    test('calls onToggle when toggle button is clicked', () => {
        render(<QueuePanel {...defaultProps} />);

        const toggleButton = screen.getByRole('button');
        fireEvent.click(toggleButton);

        expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });

    test('displays messages correctly', () => {
        render(<QueuePanel {...defaultProps} />);

        defaultProps.messages.forEach(message => {
            expect(screen.getByText(message)).toBeInTheDocument();
        });
    });

    test('displays "No messages" when messages array is empty', () => {
        render(<QueuePanel {...defaultProps} messages={[]} />);

        expect(screen.getByText('No messages in queue')).toBeInTheDocument();
    });

    test('renders pagination control with correct props', () => {
        render(<QueuePanel {...defaultProps} />);

        // Check pagination text is rendered
        expect(screen.getByText(`Page ${defaultProps.currentPage + 1} of ${defaultProps.totalPages}`)).toBeInTheDocument();

        // Check pagination buttons
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    test('pagination control receives correct props', () => {
        render(<QueuePanel {...defaultProps} currentPage={2} />);

        expect(screen.getByText('Page 3 of 5')).toBeInTheDocument();
    });

    test('handles page changes through pagination control', () => {
        render(<QueuePanel {...defaultProps} currentPage={1} />);

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    });

    test('applies correct styling classes', () => {
        render(<QueuePanel {...defaultProps} />);

        // Check main container styling
        const panel = screen.getByText('Queue Messages').parentElement?.parentElement;
        expect(panel).toHaveClass(
            'fixed',
            'top-0',
            'right-0',
            'h-full',
            'w-96',
            'bg-white',
            'shadow-lg',
            'transform',
            'transition-transform',
            'duration-300',
            'z-20'
        );

        // Check table styling
        const table = screen.getByRole('table');
        expect(table).toHaveClass('w-full');
    });

    test('renders table header correctly', () => {
        render(<QueuePanel {...defaultProps} />);

        const header = screen.getByText('Content');
        expect(header).toHaveClass('text-left', 'px-4', 'py-2', 'bg-gray-50', 'sticky', 'top-0');
    });

    test('renders message rows with correct styling', () => {
        render(<QueuePanel {...defaultProps} />);

        const messageRows = screen.getAllByRole('row').slice(1); // Skip header row
        messageRows.forEach(row => {
            expect(row).toHaveClass('border-t');
            expect(row.querySelector('td')).toHaveClass('px-4', 'py-2', 'text-sm');
        });
    });
});