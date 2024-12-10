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

    test('should render the sender and receiver count selectors when rendered', () => {
        render(<ThreadCountSelector />);

        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;

        const receiverLabel = screen.getByText('Receiver Count');
        const receiverSelect = receiverLabel.nextElementSibling;

        expect(senderSelect).toBeInTheDocument();
        expect(receiverSelect).toBeInTheDocument();
    });

    test('should render correct number of options for both selectors when rendered', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;
        const senderOptions = senderSelect.querySelectorAll('option');

        const receiverLabel = screen.getByText('Receiver Count');
        const receiverSelect = receiverLabel.nextElementSibling;
        const receiverOptions = receiverSelect.querySelectorAll('option');

        expect(senderOptions).toHaveLength(7);
        expect(receiverOptions).toHaveLength(7);
    });

    test('should generate correct option values (0, 5, 10, 15, 20, 25, 30) when rendered', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const expectedValues = [0, 5, 10, 15, 20, 25, 30];
        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;
        const senderOptions = senderSelect.querySelectorAll('option');

        senderOptions.forEach((option, index) => {
            expect(option.value).toBe(expectedValues[index].toString());
            expect(option.textContent).toBe(`${expectedValues[index]} Threads`);
        });
    });

    test('should set initial values correctly when rendered', () => {
        render(<ThreadCountSelector {...defaultProps} senderCount={10} receiverCount={15} />);

        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;

        const receiverLabel = screen.getByText('Receiver Count');
        const receiverSelect = receiverLabel.nextElementSibling;

        expect(senderSelect).toHaveValue('10');
        expect(receiverSelect).toHaveValue('15');
    });

    test('should call setSenderCount with correct value when sender count changes', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;
        fireEvent.change(senderSelect, { target: { value: '15' } });

        expect(defaultProps.setSenderCount).toHaveBeenCalledWith(15);
    });

    test('should call setReceiverCount with correct value when receiver count changes', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const receiverLabel = screen.getByText('Receiver Count');
        const receiverSelect = receiverLabel.nextElementSibling;
        fireEvent.change(receiverSelect, { target: { value: '20' } });

        expect(defaultProps.setReceiverCount).toHaveBeenCalledWith(20);
    });

    test('should apply correct styling classes to container when rendered', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;
        const container = senderSelect.closest('.grid');
        expect(container).toHaveClass(
            'grid',
            'grid-cols-1',
            'md:grid-cols-2',
            'gap-4',
            'mb-6'
        );
    });

    test('should apply correct styling to labels when rendered', () => {
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

    test('should apply correct styling to select elements when rendered', () => {
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

    test('should maintain independent state for both selectors when rendered', () => {
        render(<ThreadCountSelector {...defaultProps} />);


        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;

        const receiverLabel = screen.getByText('Receiver Count');
        const receiverSelect = receiverLabel.nextElementSibling;

        fireEvent.change(senderSelect, { target: { value: '10' } });
        fireEvent.change(receiverSelect, { target: { value: '20' } });

        expect(defaultProps.setSenderCount).toHaveBeenCalledWith(10);
        expect(defaultProps.setReceiverCount).toHaveBeenCalledWith(20);
    });

    test('should convert string values to numbers in onChange handlers when rendered', () => {
        render(<ThreadCountSelector {...defaultProps} />);

        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;
        fireEvent.change(senderSelect, { target: { value: '25' } });

        expect(defaultProps.setSenderCount).toHaveBeenCalledWith(25);
        expect(typeof defaultProps.setSenderCount.mock.calls[0][0]).toBe('number');
    });
});