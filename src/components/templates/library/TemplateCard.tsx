'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: Template;
  mode?: 'view' | 'edit';
  onSelect?: (template: Template) => void;
  onPreview?: (template: Template) => void;
  onDelete?: (template: Template) => void;
  onShare?: (template: Template) => void;
  layout?: 'grid' | 'list';
}

/**
 * TemplateCard 컴포넌트
 * 
 * 개별 템플릿을 표시하는 카드 컴포넌트
 * - Thumbnail 이미지 표시
 * - 템플릿 이름, 카테고리, 다운로드 카운트
 * - Published 상태 표시
 * - 가격 표시 (유료/무료)
 * - Edit/Delete 버튼 (edit mode)
 */
export function TemplateCard({
  template,
  mode = 'view',
  onSelect,
  onPreview,
  onDelete,
  onShare,
  layout = 'grid',
}: TemplateCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if (onPreview) {
      onPreview(template);
    } else if (mode === 'view') {
      router.push(`/templates/${template.id}`);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm(`${template.name} 템플릿을 삭제하시겠습니까?`)) {
      onDelete(template);
    }
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  const isPremium = template.price > 0;
  const isPurchased = template.isPurchased || !isPremium;

  if (layout === 'list') {
    return (
      <div onClick={handleCardClick} className="cursor-pointer">
        <Card className="group rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/60 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/10 p-4">
          <div className="flex gap-4">
            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              {template.thumbnail ? (
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  sizes="128px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-2xl">🖼️</span>
                </div>
              )}
              {isPremium && !isPurchased && (
                <div className="absolute top-1 left-1">
                  <Badge className="bg-amber-500 text-white text-xs shadow-lg">
                    {formatPrice(template.price)}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate" title={template.name}>
                {template.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{template.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>📥</span>
                  <span>{template.downloadCount}</span>
                </div>
                {template.isPublished && (
                  <Badge variant="secondary" className="bg-green-500 text-white text-xs">Published</Badge>
                )}
              </div>
              {mode === 'edit' && (
                <div className="flex gap-2 mt-3">
                  {onSelect && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); onSelect(template); }}
                      size="sm" variant="default"
                    >
                      ✏️ Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                      size="sm" variant="destructive"
                    >
                      🗑️
                    </Button>
                  )}
                  {onShare && (
                    <Button
                      onClick={(e) => { e.stopPropagation(); onShare(template); }}
                      size="sm" variant="outline"
                    >
                      📤 공유
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="group rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 bg-white/60 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/10">
      <CardHeader className="p-0 overflow-hidden">
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group-hover:scale-105 transition-transform duration-300">
          {template.thumbnail ? (
            <Image
              src={template.thumbnail}
              alt={template.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🖼️</span>
            </div>
          )}
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Published status indicator */}
          {template.isPublished && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-green-500 text-white shadow-lg">
                Published
              </Badge>
            </div>
          )}
          
          {/* Price badge */}
          <div className="absolute top-3 left-3">
            {isPremium ? (
              <Badge className={isPurchased ? 'bg-green-500 text-white shadow-lg' : 'bg-amber-500 text-white shadow-lg'}>
                {isPurchased ? '✓ 구매완료' : formatPrice(template.price)}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-lg">
                무료
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg truncate" title={template.name}>
            {template.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{template.category}</Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>📥</span>
            <span>{template.downloadCount}</span>
          </div>
        </div>
        
        {/* Actions (edit mode only) */}
        {mode === 'edit' && (
          <div className="flex gap-2 mt-3">
            {onSelect && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(template);
                }}
                className="flex-1"
                variant="default"
              >
                ✏️ Edit
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex-1"
                variant="destructive"
              >
                🗑️ Delete
              </Button>
            )}
            {onShare && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(template);
                }}
                className="flex-1"
                variant="outline"
              >
                📤 공유
              </Button>
            )}
          </div>
        )}
      </CardContent>
     </Card>
    </div>
  );
}

export default TemplateCard;
