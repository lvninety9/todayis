import { describe, it, expect } from 'vitest';
import { buttonVariants } from '@/components/ui/button';

describe('buttonVariants', () => {
  it('returns default classes when no props', () => {
    const result = buttonVariants({});
    expect(result).toContain('bg-primary');
    expect(result).toContain('text-primary-foreground');
  });

  it('returns destructive variant classes', () => {
    const result = buttonVariants({ variant: 'destructive' });
    expect(result).toContain('bg-destructive');
    expect(result).toContain('text-destructive-foreground');
  });

  it('returns outline variant classes', () => {
    const result = buttonVariants({ variant: 'outline' });
    expect(result).toContain('border');
    expect(result).toContain('bg-background');
  });

  it('returns secondary variant classes', () => {
    const result = buttonVariants({ variant: 'secondary' });
    expect(result).toContain('bg-secondary');
  });

  it('returns ghost variant classes', () => {
    const result = buttonVariants({ variant: 'ghost' });
    expect(result).toContain('hover:bg-accent');
  });

  it('returns link variant classes', () => {
    const result = buttonVariants({ variant: 'link' });
    expect(result).toContain('text-primary');
    expect(result).toContain('underline');
  });

  it('applies size classes correctly', () => {
    const sm = buttonVariants({ size: 'sm' });
    expect(sm).toContain('h-9');

    const lg = buttonVariants({ size: 'lg' });
    expect(lg).toContain('h-11');

    const icon = buttonVariants({ size: 'icon' });
    expect(icon).toContain('h-10');
    expect(icon).toContain('w-10');
  });

  it('merges custom className', () => {
    const result = buttonVariants({ className: 'custom-class' });
    expect(result).toContain('custom-class');
  });
});
