import { describe, it, expect } from 'vitest';
import { badgeVariants } from '@/components/ui/badge';

describe('badgeVariants', () => {
  it('returns default variant classes', () => {
    const result = badgeVariants({});
    expect(result).toContain('bg-primary');
    expect(result).toContain('text-primary-foreground');
    expect(result).toContain('border-transparent');
  });

  it('returns secondary variant classes', () => {
    const result = badgeVariants({ variant: 'secondary' });
    expect(result).toContain('bg-secondary');
    expect(result).toContain('text-secondary-foreground');
  });

  it('returns destructive variant classes', () => {
    const result = badgeVariants({ variant: 'destructive' });
    expect(result).toContain('bg-destructive');
    expect(result).toContain('text-destructive-foreground');
  });

  it('returns outline variant classes', () => {
    const result = badgeVariants({ variant: 'outline' });
    expect(result).toContain('text-foreground');
  });

  it('merges custom className', () => {
    const result = badgeVariants({ className: 'custom-class' });
    expect(result).toContain('custom-class');
  });

  it('includes base classes', () => {
    const result = badgeVariants({});
    expect(result).toContain('inline-flex');
    expect(result).toContain('items-center');
    expect(result).toContain('rounded-full');
    expect(result).toContain('text-xs');
    expect(result).toContain('font-semibold');
  });
});
