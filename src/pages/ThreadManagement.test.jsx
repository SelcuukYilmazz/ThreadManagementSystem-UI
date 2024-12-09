import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import ThreadManagement from './ThreadManagement';
import { useThreadManagement } from '../components/hooks/useThreadManagement';

// Mock the custom hook
jest.mock('../components/hooks/useThreadManagement');

describe('ThreadManagement', () => {
    const mockUseThreadManagement = {
        senderThreads: [
            { id: '1', state: 'ACTIVE', priority: 1 },
            { id: '2', state: 'PAUSED', priority: 2 }
        ],
        receiverThreads: [
            { id: '3', state: 'ACTIVE', priority: 1 }
        ],
        error: null,
        queueMessages: [],
        currentPage: 1,
        totalPages: 1,
        setCurrentPage: jest.fn(),
        createThreads: jest.fn(),
        updateThreadState: jest.fn(),
        updateThreadPriority: jest.fn(),
        deleteThread: jest.fn(),
        deleteAllThreads: jest.fn()
    };

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        useThreadManagement.mockReturnValue(mockUseThreadManagement);
    });

    test('renders without crashing', () => {
        render(<ThreadManagement />);
        expect(screen.getByText('Create Threads')).toBeInTheDocument();
    });

    test('updates sender count when input changes', () => {
        render(<ThreadManagement />);
        const senderInput = screen.getByLabelText(/sender threads/i);

        fireEvent.change(senderInput, { target: { value: '10' } });
        expect(senderInput).toHaveValue(10);
    });

    test('updates receiver count when input changes', () => {
        render(<ThreadManagement />);
        const receiverInput = screen.getByLabelText(/receiver threads/i);

        fireEvent.change(receiverInput, { target: { value: '8' } });
        expect(receiverInput).toHaveValue(8);
    });

    test('calls createThreads with correct values when Create Threads button is clicked', () => {
        render(<ThreadManagement />);
        const createButton = screen.getByText('Create Threads');

        fireEvent.click(createButton);
        expect(mockUseThreadManagement.createThreads).toHaveBeenCalledWith(5, 5);
    });

    test('displays error message when error exists', () => {
        const errorMessage = 'Test error message';
        useThreadManagement.mockReturnValue({
            ...mockUseThreadManagement,
            error: errorMessage
        });

        render(<ThreadManagement />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('renders correct number of sender and receiver threads', () => {
        render(<ThreadManagement />);

        // Check if sender threads are rendered
        expect(screen.getByText('Sender Threads')).toBeInTheDocument();
        mockUseThreadManagement.senderThreads.forEach(thread => {
            expect(screen.getByTestId(`sender-thread-${thread.id}`)).toBeInTheDocument();
        });

        // Check if receiver threads are rendered
        expect(screen.getByText('Receiver Threads')).toBeInTheDocument();
        mockUseThreadManagement.receiverThreads.forEach(thread => {
            expect(screen.getByTestId(`receiver-thread-${thread.id}`)).toBeInTheDocument();
        });
    });

    test('calls deleteAllThreads when Delete All button is clicked', () => {
        render(<ThreadManagement />);
        const deleteSendersButton = screen.getByText('Delete All Senders');

        fireEvent.click(deleteSendersButton);
        expect(mockUseThreadManagement.deleteAllThreads).toHaveBeenCalledWith('SENDER');
    });

    test('toggles queue panel when toggle button is clicked', () => {
        render(<ThreadManagement />);
        const toggleButton = screen.getByRole('button', { name: /toggle queue panel/i });

        fireEvent.click(toggleButton);
        expect(screen.getByTestId('queue-panel')).toHaveClass('open');

        fireEvent.click(toggleButton);
        expect(screen.getByTestId('queue-panel')).not.toHaveClass('open');
    });
});