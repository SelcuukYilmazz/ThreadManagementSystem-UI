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

    test('should render without crashing', () => {
        render(<ThreadManagement />);
        expect(screen.getByText('Create Threads')).toBeInTheDocument();
    });

    test('should update sender count when selection changes', () => {
        render(<ThreadManagement />);

        const senderLabel = screen.getByText('Sender Count');
        const senderSelect = senderLabel.nextElementSibling;

        fireEvent.change(senderSelect, { target: { value: '10' } });
        expect(senderSelect.value).toBe('10');
    });

    test('should update receiver count when selection changes', () => {
        render(<ThreadManagement />);

        const receiverLabel = screen.getByText('Receiver Count');
        const receiverSelect = receiverLabel.nextElementSibling;

        fireEvent.change(receiverSelect, { target: { value: '10' } });
        expect(receiverSelect.value).toBe('10');
    });

    test('should call createThreads with correct values when Create Threads button is clicked', () => {
        render(<ThreadManagement />);
        const createButton = screen.getByText('Create Threads');

        fireEvent.click(createButton);
        expect(mockUseThreadManagement.createThreads).toHaveBeenCalledWith(5, 5);
    });

    test('should display error message when error exists', () => {
        const errorMessage = 'Test error message';
        useThreadManagement.mockReturnValue({
            ...mockUseThreadManagement,
            error: errorMessage
        });

        render(<ThreadManagement />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

});