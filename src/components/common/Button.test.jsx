import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import '@testing-library/jest-dom';

describe('Button', () => {
    test('should render button with children when button rendered', () => {
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

    test('should apply default classes when button rendered', () => {
        render(<Button>Test Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass(
            "inline-flex",
            "items-center",
            "justify-center",
            "rounded-md",
            "text-sm",
            "font-medium",
            "ring-offset-background",
            "transition-colors",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-ring",
            "focus-visible:ring-offset-2",
            "disabled:pointer-events-none",
            "disabled:opacity-50 bg-primary",
            "text-primary-foreground",
            "hover:bg-primary/90",
            "h-10",
            "px-4",
            "py-2"
        );
    });

    test('should merge custom className with default classes when customClass given', () => {
        const customClass = 'custom-class';
        render(<Button className={customClass}>Test Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass(customClass);
        expect(button).toHaveClass('inline-flex', 'items-center'); // Verify default classes remain
    });

    test('should pass through additional props when additional props given', async () => {
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

    test('should render disabled state correctly when button disabled', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    test('should handle undefined className when undefined className given', () => {
        render(<Button className={undefined}>Test Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass('inline-flex', 'items-center');
    });
});