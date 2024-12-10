import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationControl } from './PaginationControl';
import '@testing-library/jest-dom';

describe('PaginationControl', () => {
    const mockOnPageChange = jest.fn();

    beforeEach(() => {
        mockOnPageChange.mockClear();
    });

    test('should render with all elements when rendered', () => {
        render(
            <PaginationControl
                currentPage={0}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
    });

    test('should disable Previous button when on first page', () => {
        render(
            <PaginationControl
                currentPage={0}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const previousButton = screen.getByText('Previous');
        expect(previousButton).toBeDisabled();
    });

    test('should enable Previous button when not on first page', () => {
        render(
            <PaginationControl
                currentPage={1}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const previousButton = screen.getByText('Previous');
        expect(previousButton).not.toBeDisabled();
    });

    test('should disable Next button when on last page', () => {
        render(
            <PaginationControl
                currentPage={9}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeDisabled();
    });

    test('should enable Next button when not on last page', () => {
        render(
            <PaginationControl
                currentPage={8}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const nextButton = screen.getByText('Next');
        expect(nextButton).not.toBeDisabled();
    });

    test('should call onPageChange with correct value when Previous is clicked', () => {
        render(
            <PaginationControl
                currentPage={5}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const previousButton = screen.getByText('Previous');
        fireEvent.click(previousButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    test('should calls onPageChange with correct value when Next is clicked', () => {
        render(
            <PaginationControl
                currentPage={5}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(6);
    });

    test('should apply correct styling classes when rendered', () => {
        render(
            <PaginationControl
                currentPage={0}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const container = screen.getByText('Previous').parentElement;
        expect(container).toHaveClass('flex', 'justify-between', 'items-center', 'mt-4', 'p-4', 'border-t');

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            expect(button).toHaveClass('px-3', 'py-1', 'rounded', 'bg-gray-100');
        });
    });

    test('should apply disabled styling when disabled', () => {
        render(
            <PaginationControl
                currentPage={0}
                totalPages={10}
                onPageChange={mockOnPageChange}
            />
        );

        const previousButton = screen.getByText('Previous');
        expect(previousButton).toHaveClass('disabled:opacity-50');
    });
});