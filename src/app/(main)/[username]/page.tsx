'use client';

import { useState, useEffect } from 'react';
import { Invitation } from '@/types/publish';
import { Spinner } from '@/components/ui/spinner';
import { InvitationViewer } from '@/components/publish/InvitationViewer';
import { ShareButton } from '@/components/publish/ShareButton';
import { ShareDialog } from '@/components/publish/ShareDialog';

// ISR: revalidate every 60 seconds
export const dynamicParams = true;

interface PublicInvitationResponse {
  invitation: Invitation;
  template: {
    id: string;
    name: string;
    category: string;
  };
}

export default function UsernamePage({ params }: { params: { username: string } }) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [template, setTemplate] = useState<{ id: string; name: string; category: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      const slug = params.username;

      if (!slug || slug.trim() === '') {
        setError('유효하지 않은 URL입니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/invitations/' + slug);

        if (!response.ok) {
          if (response.status === 404) {
            setError('초대장을 찾을 수 없습니다.');
          } else if (response.status === 400) {
            setError('유효하지 않은 slug입니다.');
          } else {
            setError('서버 오류가 발생했습니다.');
          }
          setLoading(false);
          return;
        }

        const data: PublicInvitationResponse = await response.json();
        setInvitation(data.invitation);
        setTemplate(data.template);
      } catch (err) {
        console.error('초대장 조회 실패:', err);
        setError('초대장을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">오류</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${invitation.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{invitation.title}</h1>
          {template && (
            <p className="mt-2 text-sm text-gray-500">
              {template.name} 템플릿
            </p>
          )}
        </div>

        {/* Invitation Viewer */}
        <div className="mb-6">
          <InvitationViewer invitation={invitation} template={template || undefined} />
        </div>

        {/* Share Button */}
        <div className="text-center">
          <ShareButton invitation={invitation} />
          <ShareDialog invitation={invitation} />
        </div>
      </div>
    </div>
  );
}
