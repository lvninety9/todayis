'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Invitation } from '@/types/publish';

interface ShareDialogProps {
  invitation: Invitation;
}

export function ShareDialog({ invitation }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${invitation.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('복사에 실패했습니다. 수동으로 복사해주세요.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>초대장 공유</DialogTitle>
          <DialogDescription>
            아래 링크를 복사하여 초대장을 공유하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            />
            <Button
              onClick={handleCopy}
              variant={copied ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap"
            >
              {copied ? '복사 완료!' : '링크 복사'}
            </Button>
          </div>

          {copied && (
            <p className="text-sm text-green-600">
              링크가 클립보드에 복사되었습니다.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
