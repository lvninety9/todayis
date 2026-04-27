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
 * Extended field type rendering helpers
 * Phase 15: Added account, audio, video, gallery, message, dresscode, parents
 */

/** Bank name lookup */
const BANK_NAMES: Record<string, string> = {
  KB: 'KB국민은행',
  NH: 'NH농협은행',
  WR: '우리은행',
  SH: '신한은행',
  IBK: 'IBK기업은행',
  KEB: 'KEB외환은행',
  SC: 'SC제일은행',
  CITI: '씨티은행',
};

/**
 * Render account field with bank name and copy button
 * Format: bank|account|holder
 */
function renderAccount(value: string): React.ReactNode {
  const parts = value.split('|');
  const bankCode = parts[0] || '';
  const accountNum = parts[1] || '';
  const holder = parts[2] || '';
  
  const bankName = BANK_NAMES[bankCode] || bankCode;
  const displayAccount = accountNum ? accountNum.replace(/(\d{4})(?=\d)/g, '$1 ') : '';
  
  const copyText = `${bankName} ${displayAccount} ${holder}`.trim();
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      // Fallback for older browsers
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg text-gray-900 font-medium">{bankName}</div>
      <div className="text-lg text-gray-900">{displayAccount}</div>
      <div className="text-sm text-gray-500">예금주: {holder}</div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="mt-1"
      >
        📋 복사
      </Button>
    </div>
  );
}

/**
 * Render gallery field
 * Format: comma-separated URLs
 */
function renderGallery(value: string): React.ReactNode {
  const urls = value.split(',').map(u => u.trim()).filter(Boolean);
  
  if (urls.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {urls.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Gallery ${idx + 1}`}
          className="w-full h-32 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ))}
    </div>
  );
}

/**
 * Render dresscode field with badge
 */
function renderDresscode(value: string): React.ReactNode {
  if (!value) return null;
  
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-sage-100 text-sage-700 text-lg font-medium">
      {value}
    </div>
  );
}

/**
 * Render parents field
 * Format: groomF|groomM|brideF|brideM
 */
function renderParents(value: string): React.ReactNode {
  const parts = value.split('|');
  const groomF = parts[0] || '';
  const groomM = parts[1] || '';
  const brideF = parts[2] || '';
  const brideM = parts[3] || '';
  
  if (!groomF && !groomM && !brideF && !brideM) return null;
  
  return (
    <div className="space-y-2 text-center">
      {(groomF || groomM) && (
        <div className="flex justify-center gap-4">
          {groomF && <div><span className="text-xs text-gray-500 block">신랑父</span><span className="text-gray-900">{groomF}</span></div>}
          {groomM && <div><span className="text-xs text-gray-500 block">신랑母</span><span className="text-gray-900">{groomM}</span></div>}
        </div>
      )}
      {(brideF || brideM) && (
        <div className="flex justify-center gap-4">
          {brideF && <div><span className="text-xs text-gray-500 block">신부父</span><span className="text-gray-900">{brideF}</span></div>}
          {brideM && <div><span className="text-xs text-gray-500 block">신부母</span><span className="text-gray-900">{brideM}</span></div>}
        </div>
      )}
    </div>
  );
}

/**
 * Render video field
 */
function renderVideo(value: string): React.ReactNode {
  if (!value) return null;
  
  return (
    <video
      controls
      src={value}
      className="w-full rounded-lg mt-2"
    />
  );
}

/**
 * Determine field type from field name conventions
 */
function detectFieldType(key: string): string {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('account') || lowerKey.includes('계좌')) return 'account';
  if (lowerKey.includes('audio') || lowerKey.includes('music') || lowerKey.includes('음악')) return 'audio';
  if (lowerKey.includes('video') || lowerKey.includes('동영상')) return 'video';
  if (lowerKey.includes('gallery') || lowerKey.includes('사진')) return 'gallery';
  if (lowerKey.includes('message') || lowerKey.includes('메시지') || lowerKey.includes('축하')) return 'message';
  if (lowerKey.includes('dresscode') || lowerKey.includes('복장')) return 'dresscode';
  if (lowerKey.includes('parent') || lowerKey.includes('부모')) return 'parents';
  return 'generic';
}

/**
 *초대장 뷰어 컴포넌트
 * invitation.data의 필드 값을 렌더링
 * data가 비어있으면 title만 표시
 * 배경 음악 지원 (자동 재생, mute 토글)
 * Phase 15: Extended to support new field types (account, gallery, dresscode, parents, video)
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

  /**
   * Render a field value based on detected or known field type
   */
  const renderFieldValue = (key: string, value: string): React.ReactNode => {
    const fieldType = detectFieldType(key);
    
    switch (fieldType) {
      case 'account':
        return renderAccount(value);
      case 'gallery':
        return renderGallery(value);
      case 'dresscode':
        return renderDresscode(value);
      case 'parents':
        return renderParents(value);
      case 'video':
        return renderVideo(value);
      case 'message':
        return <p className="text-gray-900 whitespace-pre-wrap">{value}</p>;
      default:
        return <span className="text-lg text-gray-900">{value}</span>;
    }
  };

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
                {renderFieldValue(key, value)}
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