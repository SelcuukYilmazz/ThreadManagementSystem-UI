import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import '@testing-library/jest-dom';

describe('Button', () => {
    test('renders button with children', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    test('applies default classes', () => {
        render(<Button>Test Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass(
            'inline-flex',
            'items-center',
            'justify-center',
            'rounded-md',
            'text-sm',
            'font-medium'
        );
    });

    test('merges custom className with default classes', () => {
        const customClass = 'custom-class';
        render(<Button className={customClass}>Test Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass(customClass);
        expect(button).toHaveClass('inline-flex', 'items-center'); // Verify default classes remain
    });

    test('passes through additional props', async () => {
        const handleClick = jest.fn();
        render(
            <Button onClick={handleClick} data-testid="test-button">
                Test Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        await userEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders disabled state correctly', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    test('renders with focus and hover states', () => {
        render(<Button>Interactive Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass(
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'hover:bg-primary/90'
        );
    });

    test('preserves all style-related classes', () => {
        render(<Button>Styled Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass(
            'bg-primary',
            'text-primary-foreground',
            'h-10',
            'px-4',
            'py-2'
        );
    });

    test('handles undefined className gracefully', () => {
        render(<Button className={undefined}>Test Button</Button>);
        const button = screen.getByRole('button');

        // Verify button renders with default classes
        expect(button).toHaveClass('inline-flex', 'items-center');
    });

    test('processes children correctly', () => {
        const TestChild = () => <span>Child Component</span>;
        render(
            <Button>
                <TestChild />
                Text Node
            </Button>
        );

        expect(screen.getByText('Child Component')).toBeInTheDocument();
        expect(screen.getByText('Text Node')).toBeInTheDocument();
    });
});