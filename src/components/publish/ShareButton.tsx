'use client';

import { Button } from '@/components/ui/button';
import { ShareDialog } from './ShareDialog';
import { Invitation } from '@/types/publish';

interface ShareButtonProps {
  invitation: Invitation;
}

export function ShareButton({ invitation }: ShareButtonProps) {
  return (
    <Button
      variant="outline"
      size="default"
      onClick={() => {
        const event = new CustomEvent('open-share-dialog', { detail: invitation });
        window.dispatchEvent(event);
      }}
      className="gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9A3 3 0 105.367 20.018 3 3 0 005.367 12.018m0 0l-6.632 3.316m6.632-6l-6.632-3.316m0 0a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684zm0 9A3 3 0 105.367 20.018 3 3 0 005.367 12.018m0 0l6.632-3.316"
        />
      </svg>
      공유
    </Button>
  );
}
