'use client';

import React from 'react';
import { Template, TemplateData, Section, SectionType, TemplateStyle, TemplateField } from '@/types/template';
import { validateTemplateData, getDefaultValue, renderField } from '@/lib/template-utils';
import { cn } from '@/lib/utils';

interface TemplateEngineProps {
  template: Template;
  data: TemplateData;
  style?: TemplateStyle;
}

/**
 * TemplateEngine 컴포넌트
 * 
 * 템플릿 렌더링 엔진
 * - sections가 있으면 section 기반 렌더링 우선 사용
 * - 없으면 기존 flat field 렌더링 (하위 호환)
 */
export function TemplateEngine({ template, data, style }: TemplateEngineProps) {
  // section 기반 렌더링 (sections가 있으면 우선 사용)
  if (template.sections && template.sections.length > 0) {
    return <SectionBasedRenderer sections={template.sections} data={data} style={style} />;
  }
  // 기존 flat field 렌더링 (하위 호환)
  return <FlatFieldRenderer template={template} data={data} />;
}

/* ============================================
   Section-Based Rendering
   ============================================ */

function SectionBasedRenderer({ sections, data, style }: {
  sections: Section[];
  data: TemplateData;
  style?: TemplateStyle;
}) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className={cn(
      'template-preview-sections min-h-[400px]',
      style && `template-style-${style}`
    )}>
      {sortedSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          data={data}
        />
      ))}
    </div>
  );
}

function SectionRenderer({ section, data }: {
  section: Section;
  data: TemplateData;
}) {
  const { type, fields, style } = section;

  // 애니메이션 class 적용
  const animationClass = style?.animation && style.animation !== 'none'
    ? `animate-${style.animation}`
    : '';

  const sectionStyle: React.CSSProperties = {
    ...(style?.backgroundColor && { backgroundColor: style.backgroundColor }),
    ...(style?.textColor && { color: style.textColor }),
    ...(style?.fontFamily && { fontFamily: style.fontFamily }),
    ...(style?.animationDelay != null && { animationDelay: `${style.animationDelay}ms` }),
    ...(style?.animationDuration != null && { animationDuration: `${style.animationDuration}ms` }),
  };

  switch (type) {
    case 'image':
      return <ImageSection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'announcement':
      return <AnnouncementSection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'invitation':
      return <InvitationSection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'map':
      return <MapSection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'accounts':
      return <AccountsSection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'gallery':
      return <GallerySection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'video':
      return <VideoSection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'story':
      return <StorySection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    case 'audio':
      return <AudioSection fields={fields} data={data} style={sectionStyle} className={animationClass} />;
    default:
      return null;
  }
}

/* ============================================
   Individual Section Renderers
   ============================================ */

function ImageSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const heroImage = data.getValue('heroImage') || data.getValue('imageUrl') || data.getValue('image') || '';
  const heroTitle = data.getValue('heroTitle') || data.getValue('caption') || '';
  const subtitle = data.getValue('subtitle') || '';

  return (
    <div className={cn('section-image py-8 px-4', className)} style={style}>
      <div className="relative w-full max-w-lg mx-auto">
        {heroImage ? (
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <img
              src={heroImage}
              alt={heroTitle || 'wedding photo'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          <div className="w-full aspect-[3/4] rounded-lg bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">💒</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">결혼사진을 추가하세요</p>
            </div>
          </div>
        )}
        {heroTitle && (
          <div className="absolute bottom-0 left-0 right-0 text-center text-white p-4">
            <h2 className="text-2xl font-bold drop-shadow-lg">{heroTitle}</h2>
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-center mt-4 text-sm text-gray-500 italic">{subtitle}</p>
      )}
    </div>
  );
}

function AnnouncementSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const groomName = data.getValue('groomName') || data.getValue('groom') || '';
  const brideName = data.getValue('brideName') || data.getValue('bride') || '';
  const date = data.getValue('date') || '';
  const time = data.getValue('time') || '';
  const location = data.getValue('location') || data.getValue('venue') || '';
  const announcementTitle = data.getValue('announcementTitle') || '결혼합니다';
  const announcementSubtitle = data.getValue('announcementSubtitle') || '결혼식을 축하해주세요';

  // 한국어 날짜 포맷팅
  const formattedDate = date ? (() => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[d.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  })() : '';

  return (
    <div className={cn('section-announcement py-16 px-4 text-center', className)} style={style}>
      <p className="text-sm tracking-[0.3em] opacity-60 mb-2">{announcementTitle}</p>
      
      {(groomName || brideName) && (
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          {groomName && brideName
            ? `${groomName} <span class="text-rose-400">&</span> ${brideName}`
            : announcementTitle}
        </h1>
      )}

      <p className="text-lg md:text-xl opacity-80 mb-8">{announcementSubtitle}</p>

      {(formattedDate || time || location) && (
        <div className="max-w-md mx-auto border-t border-b border-current/20 py-6">
          {formattedDate && <p className="text-xl mb-2">{formattedDate}</p>}
          {time && <p className="text-base opacity-70 mb-2">{time}</p>}
          {location && <p className="text-base opacity-80 font-medium">{location}</p>}
        </div>
      )}

      <div className="mt-8 flex justify-center gap-1">
        <div className="w-2 h-2 rounded-full bg-current opacity-30" />
        <div className="w-2 h-2 rounded-full bg-current opacity-50" />
        <div className="w-2 h-2 rounded-full bg-current opacity-30" />
      </div>
    </div>
  );
}

function InvitationSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const message = data.getValue('message') || data.getValue('invitationMessage') || '';
  const dressCode = data.getValue('dressCode') || '';
  const groomParents = data.getValue('groomParents') || '';
  const brideParents = data.getValue('brideParents') || '';
  const groomName = data.getValue('groomName') || data.getValue('groom') || '';
  const brideName = data.getValue('brideName') || data.getValue('bride') || '';
  const date = data.getValue('date') || '';
  const time = data.getValue('time') || '';
  const venue = data.getValue('venue') || data.getValue('location') || '';
  const venueAddress = data.getValue('venueAddress') || '';

  // 한국어 날짜 포맷팅
  const formattedDate = date ? (() => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[d.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  })() : '';

  return (
    <div className={cn('section-invitation py-12 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto">
        {/* 부모님 성함 */}
        {(groomParents || brideParents) && (
          <div className="mb-10 text-center">
            {brideParents && (
              <p className="text-sm mb-1 opacity-70">{brideParents}</p>
            )}
            {groomParents && (
              <p className="text-sm opacity-70">{groomParents}</p>
            )}
          </div>
        )}

        {/* 초대 문구 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {groomName && brideName
              ? `${groomName}과 ${brideName}의 결혼식을 축하해주세요`
              : '결혼식을 축하해주세요'}
          </h2>
          
          {message && (
            <div className="whitespace-pre-line text-base opacity-80 leading-relaxed mb-6">
              {message}
            </div>
          )}

          {/* 날짜와 시간 */}
          {(formattedDate || time) && (
            <div className="mb-6">
              {formattedDate && <p className="text-lg mb-1">{formattedDate}</p>}
              {time && <p className="text-base opacity-70">{time}</p>}
            </div>
          )}

          {/* 장소 */}
          {venue && (
            <div className="border-t border-b border-current/20 py-4">
              <p className="text-lg font-semibold mb-1">{venue}</p>
              {venueAddress && (
                <p className="text-sm opacity-70">{venueAddress}</p>
              )}
            </div>
          )}
        </div>

        {/* 드레스 코드 */}
        {dressCode && (
          <div className="text-center">
            <span className="inline-block px-4 py-2 rounded-full border border-current/20 text-sm">
              Dress Code: {dressCode}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MapSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const venueName = data.getValue('venueName') || data.getValue('venue') || '';
  const address = data.getValue('address') || data.getValue('venueAddress') || '';
  const mapUrl = data.getValue('mapUrl') || '';
  const navigation = data.getValue('navigation') || '';
  const subways = data.getValue('subways') || '';

  // 네이버 지도 임베드 URL 생성
  const naverMapUrl = address
    ? `https://map.naver.com/v3/search?query=${encodeURIComponent(address)}`
    : null;

  // Google Maps 임베드
  const googleEmbedUrl = address
    ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d!2d!3d!3m2!1f!2f!3f!4f!3m2!1i!2i!4m6!2i!`
    : null;

  return (
    <div className={cn('section-map py-12 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-center mb-6">오시는 길</h3>
        
        {venueName && <p className="text-lg text-center font-medium mb-1">{venueName}</p>}
        {address && <p className="text-sm text-center opacity-70 mb-1">{address}</p>}
        {navigation && <p className="text-sm text-center opacity-60 mb-6">{navigation}</p>}
        {subways && (
          <div className="text-center text-sm opacity-70 mb-6 whitespace-pre-line">
            {subways}
          </div>
        )}

        {/* 지도 임베드 */}
        {address && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md mb-6 bg-gray-100">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="결혼식 장소 지도"
              className="w-full h-full"
            />
          </div>
        )}

        {/* 링크 버튼들 */}
        <div className="flex flex-col gap-2">
          {naverMapUrl && (
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              🗺️ 네이버 지도 보기
            </a>
          )}
          {mapUrl && mapUrl !== 'https://map.naver.com' && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              🔗 지도 링크
            </a>
          )}
          {navigation && (
            <a
              href={`https://map.naver.com/v3/search?query=${encodeURIComponent(navigation)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
            >
              📍 네비게이션 이동
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountsSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const groomAccount = data.getValue('groomAccount') || '';
  const groomBank = data.getValue('groomBank') || '';
  const groomHolder = data.getValue('groomHolder') || '';
  const brideAccount = data.getValue('brideAccount') || '';
  const brideBank = data.getValue('brideBank') || '';
  const brideHolder = data.getValue('brideHolder') || '';
  const groomPhone = data.getValue('groomPhone') || '';
  const bridePhone = data.getValue('bridePhone') || '';
  const plannerName = data.getValue('plannerName') || '';
  const plannerPhone = data.getValue('plannerPhone') || '';

  const hasAccounts = groomAccount || brideAccount;
  const hasContacts = groomPhone || bridePhone || plannerName || plannerPhone;

  if (!hasAccounts && !hasContacts) return null;

  return (
    <div className={cn('section-accounts py-12 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto">
        {/* 축의금 계좌 */}
        {hasAccounts && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-center mb-6">축하 메시지</h3>
            <div className="space-y-4">
              {groomBank && groomAccount && (
                <div className="p-4 rounded-lg bg-current/5 text-center">
                  <p className="text-xs opacity-60 mb-1">신랑측</p>
                  <p className="text-sm mb-1">
                    {groomBank} <span className="font-mono">{groomAccount}</span>
                  </p>
                  {groomHolder && <p className="text-xs opacity-70">{groomHolder}</p>}
                </div>
              )}
              {brideBank && brideAccount && (
                <div className="p-4 rounded-lg bg-current/5 text-center">
                  <p className="text-xs opacity-60 mb-1">신부측</p>
                  <p className="text-sm mb-1">
                    {brideBank} <span className="font-mono">{brideAccount}</span>
                  </p>
                  {brideHolder && <p className="text-xs opacity-70">{brideHolder}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 연락처 */}
        {hasContacts && (
          <div>
            <h3 className="text-xl font-bold text-center mb-6">문의 연락처</h3>
            <div className="space-y-3">
              {groomPhone && (
                <div className="text-center text-sm">
                  <span className="opacity-60">신랑:</span>{' '}
                  <a href={`tel:${groomPhone}`} className="font-mono">{groomPhone}</a>
                </div>
              )}
              {bridePhone && (
                <div className="text-center text-sm">
                  <span className="opacity-60">신부:</span>{' '}
                  <a href={`tel:${bridePhone}`} className="font-mono">{bridePhone}</a>
                </div>
              )}
              {plannerName && (
                <div className="text-center text-sm">
                  <span className="opacity-60">{plannerName} 플래너:</span>{' '}
                  <a href={`tel:${plannerPhone}`} className="font-mono">{plannerPhone}</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GallerySection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const galleryUrls = data.getValue('gallery') || data.getValue('images') || '';
  const galleryTitle = data.getValue('galleryTitle') || '우리 이야기';
  const image1 = data.getValue('image1') || '';
  const image2 = data.getValue('image2') || '';
  const image3 = data.getValue('image3') || '';
  const image4 = data.getValue('image4') || '';
  const image5 = data.getValue('image5') || '';
  const image6 = data.getValue('image6') || '';

  // gallery 필드 또는 개별 이미지 필드 사용
  const images = galleryUrls
    ? galleryUrls.split(',').map((u: string) => u.trim()).filter((u: string) => u)
    : [image1, image2, image3, image4, image5, image6].filter((u: string) => u);

  if (images.length === 0) return null;

  return (
    <div className={cn('section-gallery py-12 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-center mb-8">{galleryTitle}</h3>
        <div className="grid grid-cols-2 gap-3">
          {images.slice(0, 6).map((url: string, idx: number) => (
            <div key={idx} className={cn(
              'aspect-square rounded-lg overflow-hidden shadow-sm',
              idx === 0 && 'col-span-2 aspect-[2/1]'
            )}>
              <img
                src={url}
                alt={`gallery-${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorySection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const storyTitle = data.getValue('storyTitle') || '우리 이야기';
  const story1 = data.getValue('story1') || '';
  const story2 = data.getValue('story2') || '';
  const story3 = data.getValue('story3') || '';

  const stories = [story1, story2, story3].filter((s: string) => s);

  if (stories.length === 0) return null;

  return (
    <div className={cn('section-story py-12 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-center mb-8">{storyTitle}</h3>
        <div className="space-y-8">
          {stories.map((text: string, idx: number) => (
            <div key={idx} className="text-center">
              <div className="w-3 h-3 rounded-full bg-rose-300 mx-auto mb-3" />
              <p className="text-sm whitespace-pre-line opacity-80 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
    Audio Section Renderer
    ============================================ */

function AudioSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const audioUrl = data.getValue('audioUrl') || '';
  const audioTitle = data.getValue('audioTitle') || '배경음악';

  if (!audioUrl) return null;

  return (
    <div className={cn('section-audio py-8 px-4', className)} style={style}>
      <h3 className="text-center text-lg font-semibold mb-4">{audioTitle}</h3>
      <div className="max-w-lg mx-auto">
        <audio
          src={audioUrl}
          controls
          loop
          className="w-full"
          preload="metadata"
        />
      </div>
    </div>
  );
}

/* ============================================
    Video Section Renderer
    ============================================ */

function VideoSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const videoUrl = data.getValue('videoUrl') || data.getValue('video') || '';
  const videoTitle = data.getValue('videoTitle') || '결혼식 영상';

  const isYouTube = (url: string) => {
    return /youtube\.com|youtu\.be/i.test(url);
  };

  const isBilibili = (url: string) => {
    return /bilibili\.com/i.test(url);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:.*\/.*\/|.*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  const getBilibiliEmbedUrl = (url: string) => {
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&high_quality=1`;
    }
    return null;
  };

  const renderVideoPlayer = () => {
    if (!videoUrl) return null;

    if (isYouTube(videoUrl)) {
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoTitle}
          />
        );
      }
    }

    if (isBilibili(videoUrl)) {
      const embedUrl = getBilibiliEmbedUrl(videoUrl);
      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className="w-full aspect-video"
            allowFullScreen
            title={videoTitle}
          />
        );
      }
    }

    return (
      <video
        controls
        src={videoUrl}
        className="w-full aspect-video"
        preload="metadata"
      />
    );
  };

  return (
    <div className={cn('section-video py-8 px-4', className)} style={style}>
      <h3 className="text-center text-lg font-semibold mb-4">{videoTitle}</h3>
      {videoUrl && (
        <div className="max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg">
          {renderVideoPlayer()}
        </div>
      )}
    </div>
  );
}

/* ============================================
    Flat Field Rendering (Backward Compatible)
    ============================================ */

function FlatFieldRenderer({ template, data }: {
  template: Template;
  data: TemplateData;
}) {
  const isValid = validateTemplateData(data, template.fields);
  const hasAnyValue = template.fields.length > 0 && template.fields.some((f) => {
    const val = data.getValue(f.name);
    return val && val !== '';
  });

  if (!isValid || !hasAnyValue) {
    return (
      <div className="template-engine error min-h-[400px] flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--primary))/0.1] flex items-center justify-center">
            <svg className="w-8 h-8 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
            데이터를 입력해주세요
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            편집기에서 이름, 날짜, 장소 등을 입력하면 여기에 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  const renderFields = () => {
    return template.fields.map((field) => {
      const value = data.getValue(field.name);
      const displayValue = getDefaultValue(value, field);
      return (
        <div key={field.name} className={`field ${field.type}-field`}>
          <label>{field.label}</label>
          <div className="field-value">
            {renderField(displayValue, field.type)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="template-engine">
      <div className="template-header">
        <h1>{template.name}</h1>
      </div>
      <div className="template-body">
        {renderFields()}
      </div>
    </div>
  );
}

export default TemplateEngine;
