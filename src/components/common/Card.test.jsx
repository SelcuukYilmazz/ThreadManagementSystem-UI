import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import '@testing-library/jest-dom';

describe('Card Components', () => {
    describe('Card', () => {
        test('renders with default classes', () => {
            render(<Card>Card Content</Card>);
            const card = screen.getByText('Card Content');

            expect(card).toHaveClass(
                'bg-white',
                'rounded-lg',
                'border',
                'shadow-sm'
            );
        });

        test('merges custom className with defaults', () => {
            const customClass = 'custom-card';
            render(<Card className={customClass}>Card Content</Card>);
            const card = screen.getByText('Card Content');

            expect(card).toHaveClass(customClass);
            expect(card).toHaveClass('bg-white', 'rounded-lg');
        });

        test('passes through additional props', () => {
            render(<Card data-testid="test-card">Card Content</Card>);
            const card = screen.getByTestId('test-card');

            expect(card).toBeInTheDocument();
        });
    });

    describe('CardHeader', () => {
        test('renders with default classes', () => {
            render(<CardHeader>Header Content</CardHeader>);
            const header = screen.getByText('Header Content');

            expect(header).toHaveClass(
                'p-6',
                'pb-4'
            );
        });

        test('merges custom className with defaults', () => {
            const customClass = 'custom-header';
            render(<CardHeader className={customClass}>Header Content</CardHeader>);
            const header = screen.getByText('Header Content');

            expect(header).toHaveClass(customClass);
            expect(header).toHaveClass('p-6', 'pb-4');
        });

        test('passes through additional props', () => {
            render(<CardHeader data-testid="test-header">Header Content</CardHeader>);
            const header = screen.getByTestId('test-header');

            expect(header).toBeInTheDocument();
        });
    });

    describe('CardTitle', () => {
        test('renders with default classes', () => {
            render(<CardTitle>Title Content</CardTitle>);
            const title = screen.getByText('Title Content');

            expect(title).toHaveClass(
                'text-2xl',
                'font-semibold',
                'leading-none',
                'tracking-tight'
            );
        });

        test('renders as h3 element', () => {
            render(<CardTitle>Title Content</CardTitle>);
            const title = screen.getByText('Title Content');

            expect(title.tagName).toBe('H3');
        });

        test('merges custom className with defaults', () => {
            const customClass = 'custom-title';
            render(<CardTitle className={customClass}>Title Content</CardTitle>);
            const title = screen.getByText('Title Content');

            expect(title).toHaveClass(customClass);
            expect(title).toHaveClass('text-2xl', 'font-semibold');
        });

        test('passes through additional props', () => {
            render(<CardTitle data-testid="test-title">Title Content</CardTitle>);
            const title = screen.getByTestId('test-title');

            expect(title).toBeInTheDocument();
        });
    });

    describe('CardContent', () => {
        test('renders with default classes', () => {
            render(<CardContent>Content</CardContent>);
            const content = screen.getByText('Content');

            expect(content).toHaveClass(
                'p-6',
                'pt-0'
            );
        });

        test('merges custom className with defaults', () => {
            const customClass = 'custom-content';
            render(<CardContent className={customClass}>Content</CardContent>);
            const content = screen.getByText('Content');

            expect(content).toHaveClass(customClass);
            expect(content).toHaveClass('p-6', 'pt-0');
        });

        test('passes through additional props', () => {
            render(<CardContent data-testid="test-content">Content</CardContent>);
            const content = screen.getByTestId('test-content');

            expect(content).toBeInTheDocument();
        });
    });

    describe('Card Component Integration', () => {
        test('renders full card structure correctly', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                    </CardHeader>
                    <CardContent>Card Content</CardContent>
                </Card>
            );

            expect(screen.getByText('Card Title')).toBeInTheDocument();
            expect(screen.getByText('Card Content')).toBeInTheDocument();

            const title = screen.getByText('Card Title');
            expect(title.tagName).toBe('H3');
            expect(title.parentElement).toHaveClass('p-6', 'pb-4');
        });

        test('handles undefined className gracefully', () => {
            render(
                <Card className={undefined}>
                    <CardHeader className={undefined}>
                        <CardTitle className={undefined}>Title</CardTitle>
                    </CardHeader>
                    <CardContent className={undefined}>Content</CardContent>
                </Card>
            );

            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });
});