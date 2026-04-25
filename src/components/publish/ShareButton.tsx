'use client';

import { Button } from '@/components/ui/button';
import { Invitation } from '@/types/publish';

interface ShareButtonProps {
  invitation: Invitation;
}

export function ShareButton({ invitation }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: invitation.title,
        text: `${invitation.title} 초대장입니다.`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="gradient"
      size="icon"
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
      aria-label="공유하기"
    >
      <svg
        className="w-6 h-6"
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
    </Button>
  );
}
