'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Invitation } from '@/types/publish';
import { getFontFamily, loadCustomFontCSS, CustomFont } from '@/lib/fonts';

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
 * data가 비어있으면 title만 표시
 * 배경 음악 지원 (자동 재생, mute 토글)
 */
export function InvitationViewer({ invitation, template }: InvitationViewerProps) {
  const layout = invitation.layout as Record<string, unknown> || {};
  const dataEntries = Object.entries(invitation.data || {}).filter(([, value]) => value);
  
  // 폰트 관련 데이터
  const fontFamily = (layout as Record<string, string>).fontFamily || 'inherit';
  const customFonts = (layout as Record<string, CustomFont[]>).customFonts || [];
  const [customFontCSS, setCustomFontCSS] = useState('');

  useEffect(() => {
    if (customFonts.length > 0) {
      const css = loadCustomFontCSS(customFonts);
      setCustomFontCSS(css);

      const styleId = 'custom-font-injection';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = css;

      return () => {
        if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
      };
    }
  }, [customFonts]);
  
  // 음악 관련 데이터
  const musicUrl = (layout as Record<string, string>).musicUrl || (invitation.data as Record<string, string>).musicUrl;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 음악 재생/정지
  const toggleMusic = () => {
    if (!audioRef.current || !musicUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // 음악 URL이 있으면 오디오 플레이어 렌더링
  const renderAudioPlayer = () => {
    if (!musicUrl) return null;

    return (
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    );
  };

  const effectiveFontFamily = fontFamily === 'custom' && customFonts.length > 0
    ? `'${customFonts[0].family}', sans-serif`
    : getFontFamily(fontFamily);

  return (
    <div
      className="relative"
      style={customFonts.length > 0 ? {
        '--font-custom': `'${customFonts[0].family}', sans-serif`,
      } as React.CSSProperties : undefined}
    >
      {/* 음악 컨트롤 버튼 */}
      {musicUrl && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="sm"
            onClick={toggleMusic}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            title={isPlaying ? '음악 끄기' : '음악 켜기'}
          >
            {isPlaying ? '🔊' : '🔇'}
          </Button>
        </div>
      )}

      <Card className="shadow-lg border-0" style={{ fontFamily: effectiveFontFamily }}>
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
          {dataEntries.length > 0 ? (
            dataEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {key}
                </span>
                <span className="text-lg text-gray-900 mt-1">{value}</span>
              </div>
            ))
          ) : (
            // data가 비어있으면 표시할 메세지
            <div className="text-center py-4 text-gray-500">
              <p>초대장 정보가 없습니다</p>
            </div>
          )}

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

      {/* 오디오 플레이어 (숨김) */}
      {renderAudioPlayer()}
    </div>
  );
}

export default InvitationViewer;