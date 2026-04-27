import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        terracotta: 'border-transparent bg-[hsl(12,75%,55%)]/15 text-[hsl(12,75%,55%)] hover:bg-[hsl(12,75%,55%)]/25',
        sage: 'border-transparent bg-[hsl(160,35%,45%)]/15 text-[hsl(160,35%,45%)] hover:bg-[hsl(160,35%,45%)]/25',
        blush: 'border-transparent bg-[hsl(350,70%,60%)]/15 text-[hsl(350,70%,60%)] hover:bg-[hsl(350,70%,60%)]/25',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'terracotta' | 'sage' | 'blush';
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
