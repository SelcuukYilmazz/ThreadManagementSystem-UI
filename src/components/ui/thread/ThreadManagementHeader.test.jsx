import { render, screen } from '@testing-library/react';
import { ThreadManagementHeader } from './ThreadManagementHeader';
import '@testing-library/jest-dom';

describe('ThreadManagementHeader', () => {
    test('should render the title correctly when rendered', () => {
        render(<ThreadManagementHeader />);

        expect(screen.getByText('Thread Management System')).toBeInTheDocument();
    });

    test('should not render error message when error is null', () => {
        render(<ThreadManagementHeader error={null} />);

        const errorContainer = screen.queryByRole('alert');
        expect(errorContainer).not.toBeInTheDocument();
    });

    test('should not render error message when error is undefined', () => {
        render(<ThreadManagementHeader />);

        const errorContainer = screen.queryByRole('alert');
        expect(errorContainer).not.toBeInTheDocument();
    });

    test('should render error message when error is provided', () => {
        const errorMessage = 'Test error message';
        render(<ThreadManagementHeader error={errorMessage} />);

        const errorText = screen.getByText(errorMessage);
        expect(errorText).toBeInTheDocument();

        const errorContainer = errorText.parentElement;
        expect(errorContainer).toHaveClass(
            'bg-red-100',
            'border',
            'border-red-400',
            'text-red-700',
            'px-4',
            'py-3',
            'rounded',
            'mb-4'
        );
    });

    test('should render CardHeader and CardTitle components when rendered', () => {
        render(<ThreadManagementHeader />);

        const header = screen.getByText('Thread Management System').closest('div');
        expect(header).toBeInTheDocument();
    });

    test('should render error with correct styling when rendered', () => {
        const errorMessage = 'Test error message';
        render(<ThreadManagementHeader error={errorMessage} />);

        const errorContainer = screen.getByText(errorMessage).parentElement;
        expect(errorContainer).toHaveClass(
            'bg-red-100',
            'border',
            'border-red-400',
            'text-red-700'
        );
    });

    test('should handle empty string error when error thrown', () => {
        render(<ThreadManagementHeader error="" />);

        const errorContainer = screen.queryByRole('alert');
        expect(errorContainer).not.toBeInTheDocument();
    });

    test('should maintain layout structure with and without error when rendered fully', () => {
        const { rerender } = render(<ThreadManagementHeader />);

        // Check layout without error
        let container = screen.getByText('Thread Management System').closest('div');
        expect(container).toBeInTheDocument();

        // Check layout with error
        rerender(<ThreadManagementHeader error="Test error" />);
        container = screen.getByText('Thread Management System').closest('div');
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });
});