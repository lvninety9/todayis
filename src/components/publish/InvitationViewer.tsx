'use client';

/**
 * InvitationViewer
 * 
 * 공개된 초대장의 데이터를 렌더링하는 뷰어 컴포넌트
 * - invitation.data의 key-value 쌍을 렌더링
 * - 템플릿 정보 표시
 * - 레이아웃 설정 적용 (선택적)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invitation } from '@/types/publish';

interface InvitationViewerProps {
  /** 공개된 초대장 데이터 */
  invitation: Invitation;
  /** 템플릿 정보 (선택적) */
  template?: {
    id: string;
    name: string;
    category: string;
  };
}

/**
 * 초대장 뷰어 컴포넌트
 * invitation.data의 필드 값을 렌더링
 */
export function InvitationViewer({ invitation, template }: InvitationViewerProps) {
  const layout = invitation.layout as Record<string, unknown> || {};

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {invitation.title}
        </CardTitle>
        {template && (
          <p className="text-sm text-gray-500 mt-1">
            {template.name} 템플릿
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {Object.entries(invitation.data).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col items-center py-3 border-b border-gray-100 last:border-b-0"
          >
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {key}
            </span>
            <span className="text-lg text-gray-900 mt-1">{value}</span>
          </div>
        ))}

        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            {new Date(invitation.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            에 생성된 초대장
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
