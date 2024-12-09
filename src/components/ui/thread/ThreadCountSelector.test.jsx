import { render, screen, fireEvent } from '@testing-library/react';
import { ThreadCountSelector } from './ThreadCountSelector';
import '@testing-library/jest-dom';

describe('ThreadCountSelector', () => {
    const defaultProps = {
        senderCount: 0,
        receiverCount: 0,
        setSenderCount: jest.fn(),
        setReceiverCount: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders both sender and receiver count selectors', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        expect(screen.getByLabelText('Sender Count')).toBeInTheDocument();
        expect(screen.getByLabelText('Receiver Count')).toBeInTheDocument();
    });

    test('renders correct number of options for both selectors', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderOptions = screen.getByLabelText('Sender Count').querySelectorAll('option');
        const receiverOptions = screen.getByLabelText('Receiver Count').querySelectorAll('option');

        expect(senderOptions).toHaveLength(7);
        expect(receiverOptions).toHaveLength(7);
    });

    test('generates correct option values (0, 5, 10, 15, 20, 25, 30)', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const expectedValues = [0, 5, 10, 15, 20, 25, 30];
        const senderOptions = screen.getByLabelText('Sender Count').querySelectorAll('option');

        senderOptions.forEach((option, index) => {
            expect(option.value).toBe(expectedValues[index].toString());
            expect(option.textContent).toBe(`${expectedValues[index]} Threads`);
        });
    });

    test('sets initial values correctly', () => {
        render(<ThreadCountSelector {...defaultProps} senderCount={10} receiverCount={15} />);

        expect(screen.getByLabelText('Sender Count')).toHaveValue('10');
        expect(screen.getByLabelText('Receiver Count')).toHaveValue('15');
    });

    test('calls setSenderCount with correct value when sender count changes', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderSelect = screen.getByLabelText('Sender Count');
        fireEvent.change(senderSelect, { target: { value: '15' } });

        expect(defaultProps.setSenderCount).toHaveBeenCalledWith(15);
    });

    test('calls setReceiverCount with correct value when receiver count changes', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const receiverSelect = screen.getByLabelText('Receiver Count');
        fireEvent.change(receiverSelect, { target: { value: '20' } });

        expect(defaultProps.setReceiverCount).toHaveBeenCalledWith(20);
    });

    test('applies correct styling classes to container', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const container = screen.getByLabelText('Sender Count').closest('.grid');
        expect(container).toHaveClass(
            'grid',
            'grid-cols-1',
            'md:grid-cols-2',
            'gap-4',
            'mb-6'
        );
    });

    test('applies correct styling to labels', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const labels = screen.getAllByText(/Count$/);
        labels.forEach(label => {
            expect(label).toHaveClass(
                'block',
                'text-sm',
                'font-medium',
                'mb-1'
            );
        });
    });

    test('applies correct styling to select elements', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const selects = screen.getAllByRole('combobox');
        selects.forEach(select => {
            expect(select).toHaveClass(
                'w-full',
                'p-2',
                'border',
                'rounded-md'
            );
        });
    });

    test('maintains independent state for both selectors', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderSelect = screen.getByLabelText('Sender Count');
        const receiverSelect = screen.getByLabelText('Receiver Count');

        fireEvent.change(senderSelect, { target: { value: '10' } });
        fireEvent.change(receiverSelect, { target: { value: '20' } });

        expect(defaultProps.setSenderCount).toHaveBeenCalledWith(10);
        expect(defaultProps.setReceiverCount).toHaveBeenCalledWith(20);
    });

    test('converts string values to numbers in onChange handlers', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderSelect = screen.getByLabelText('Sender Count');
        fireEvent.change(senderSelect, { target: { value: '25' } });

        expect(defaultProps.setSenderCount).toHaveBeenCalledWith(25);
        expect(typeof defaultProps.setSenderCount.mock.calls[0][0]).toBe('number');
    });
});