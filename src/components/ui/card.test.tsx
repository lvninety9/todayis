import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card', () => {
  it('renders with default classes', () => {
    render(<Card data-testid="card">Content</Card>);
    const container = screen.getByTestId('card');
    expect(container.className).toContain('rounded-lg');
    expect(container.className).toContain('border');
    expect(container.className).toContain('shadow-sm');
  });

  it('accepts custom className', () => {
    render(<Card data-testid="card" className="custom-class">Content</Card>);
    const container = screen.getByTestId('card');
    expect(container.className).toContain('custom-class');
  });

  it('accepts ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).not.toBeNull();
  });
});

describe('CardHeader', () => {
  it('renders with correct classes', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);
    const container = screen.getByTestId('header');
    expect(container.className).toContain('flex');
    expect(container.className).toContain('flex-col');
    expect(container.className).toContain('p-6');
  });

  it('accepts custom className', () => {
    render(<CardHeader data-testid="header" className="custom-class">Header</CardHeader>);
    const container = screen.getByTestId('header');
    expect(container.className).toContain('custom-class');
  });

  it('accepts ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Header</CardHeader>);
    expect(ref.current).not.toBeNull();
  });
});

describe('CardTitle', () => {
  it('renders as h3 with correct classes', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const container = screen.getByTestId('title');
    expect(container.tagName).toBe('H3');
    expect(container.className).toContain('text-2xl');
    expect(container.className).toContain('font-semibold');
  });

  it('accepts custom className', () => {
    render(<CardTitle data-testid="title" className="custom-class">Title</CardTitle>);
    const container = screen.getByTestId('title');
    expect(container.className).toContain('custom-class');
  });

  it('accepts ref', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<CardTitle ref={ref}>Title</CardTitle>);
    expect(ref.current).not.toBeNull();
  });
});

describe('CardDescription', () => {
  it('renders as p with correct classes', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>);
    const container = screen.getByTestId('desc');
    expect(container.tagName).toBe('P');
    expect(container.className).toContain('text-sm');
    expect(container.className).toContain('text-muted-foreground');
  });

  it('accepts custom className', () => {
    render(<CardDescription data-testid="desc" className="custom-class">Description</CardDescription>);
    const container = screen.getByTestId('desc');
    expect(container.className).toContain('custom-class');
  });

  it('accepts ref', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<CardDescription ref={ref}>Description</CardDescription>);
    expect(ref.current).not.toBeNull();
  });
});

describe('CardContent', () => {
  it('renders with correct classes', () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const container = screen.getByTestId('content');
    expect(container.className).toContain('p-6');
    expect(container.className).toContain('pt-0');
  });

  it('accepts custom className', () => {
    render(<CardContent data-testid="content" className="custom-class">Content</CardContent>);
    const container = screen.getByTestId('content');
    expect(container.className).toContain('custom-class');
  });

  it('accepts ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).not.toBeNull();
  });
});

describe('CardFooter', () => {
  it('renders with correct classes', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const container = screen.getByTestId('footer');
    expect(container.className).toContain('flex');
    expect(container.className).toContain('items-center');
    expect(container.className).toContain('p-6');
    expect(container.className).toContain('pt-0');
  });

  it('accepts custom className', () => {
    render(<CardFooter data-testid="footer" className="custom-class">Footer</CardFooter>);
    const container = screen.getByTestId('footer');
    expect(container.className).toContain('custom-class');
  });

  it('accepts ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).not.toBeNull();
  });
});
