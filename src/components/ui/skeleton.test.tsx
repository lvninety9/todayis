import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('renders with default classes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const container = screen.getByTestId('skeleton');
    expect(container.tagName).toBe('DIV');
    expect(container.className).toContain('animate-pulse');
    expect(container.className).toContain('rounded-md');
    expect(container.className).toContain('bg-muted');
  });

  it('accepts custom className', () => {
    render(<Skeleton data-testid="skeleton" className="custom-class" />);
    const container = screen.getByTestId('skeleton');
    expect(container.className).toContain('custom-class');
  });

  it('merges custom className with default classes', () => {
    render(<Skeleton data-testid="skeleton" className="custom-class" />);
    const container = screen.getByTestId('skeleton');
    expect(container.className).toContain('animate-pulse');
    expect(container.className).toContain('rounded-md');
    expect(container.className).toContain('bg-muted');
    expect(container.className).toContain('custom-class');
  });
});
