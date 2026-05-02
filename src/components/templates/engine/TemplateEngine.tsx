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
  const imageUrl = data.getValue('imageUrl') || data.getValue('image') || '';
  const caption = data.getValue('caption') || '';

  return (
    <div className={cn('section-image py-8 px-4', className)} style={style}>
      {imageUrl ? (
        <div className="relative w-full max-w-lg mx-auto aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
          <img
            src={imageUrl}
            alt={caption || 'wedding photo'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="w-full max-w-lg mx-auto aspect-[4/3] rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-4xl text-gray-400">📷</span>
        </div>
      )}
      {caption && (
        <p className="text-center mt-3 text-sm text-gray-500 italic">{caption}</p>
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

  return (
    <div className={cn('section-announcement py-16 px-4 text-center', className)} style={style}>
      <p className="text-lg mb-4 tracking-widest opacity-70">WE ARE GETTING MARRIED</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        {groomName && brideName
          ? `${groomName} & ${brideName}`
          : '결혼합니다'}
      </h1>
      {date && (
        <p className="text-xl opacity-80">{date}</p>
      )}
      <div className="mt-6 w-16 h-px bg-current mx-auto opacity-30" />
    </div>
  );
}

function InvitationSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const groomName = data.getValue('groomName') || data.getValue('groom') || '';
  const brideName = data.getValue('brideName') || data.getValue('bride') || '';
  const groomParents = data.getValue('groomParents') || '';
  const brideParents = data.getValue('brideParents') || '';
  const date = data.getValue('date') || '';
  const time = data.getValue('time') || '';
  const venue = data.getValue('venue') || '';
  const venueAddress = data.getValue('venueAddress') || '';

  return (
    <div className={cn('section-invitation py-12 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto text-center">
        {/* 부모님 성함 */}
        {(groomParents || brideParents) && (
          <div className="mb-8 space-y-2">
            {brideParents && (
              <p className="text-sm opacity-70">{brideParents}</p>
            )}
            {groomParents && (
              <p className="text-sm opacity-70">{groomParents}</p>
            )}
          </div>
        )}

        {/* 초대 문구 */}
        <h2 className="text-2xl font-bold mb-6">
          {groomName && brideName
            ? `${groomName}과 ${brideName}의 결혼식을 축하해주세요`
            : '결혼식을 축하해주세요'}
        </h2>

        {/* 날짜와 시간 */}
        {(date || time) && (
          <div className="mb-6">
            {date && <p className="text-lg mb-1">{date}</p>}
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
    </div>
  );
}

function MapSection({ fields, data, style, className }: {
  fields: TemplateField[];
  data: TemplateData;
  style?: React.CSSProperties;
  className?: string;
}) {
  const venue = data.getValue('venue') || '';
  const venueAddress = data.getValue('venueAddress') || '';

  const mapUrl = venueAddress
    ? `https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`
    : null;

  return (
    <div className={cn('section-map py-8 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto text-center">
        <h3 className="text-xl font-bold mb-4">오시는 길</h3>
        {venue && <p className="text-lg mb-1">{venue}</p>}
        {venueAddress && <p className="text-sm opacity-70 mb-4">{venueAddress}</p>}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-current/10 rounded-full text-sm hover:bg-current/20 transition-colors"
          >
            📍 지도 보기
          </a>
        )}
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
  const brideAccount = data.getValue('brideAccount') || '';
  const brideBank = data.getValue('brideBank') || '';

  const hasAccounts = groomAccount || brideAccount;

  if (!hasAccounts) return null;

  return (
    <div className={cn('section-accounts py-8 px-4', className)} style={style}>
      <div className="max-w-lg mx-auto text-center">
        <h3 className="text-xl font-bold mb-6">축하 메시지</h3>
        <div className="space-y-4">
          {groomBank && groomAccount && (
            <div className="p-4 rounded-lg bg-current/5">
              <p className="text-sm opacity-70 mb-1">신랑측</p>
              <p className="text-sm">{groomBank} {groomAccount}</p>
            </div>
          )}
          {brideBank && brideAccount && (
            <div className="p-4 rounded-lg bg-current/5">
              <p className="text-sm opacity-70 mb-1">신부측</p>
              <p className="text-sm">{brideBank} {brideAccount}</p>
            </div>
          )}
        </div>
      </div>
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
