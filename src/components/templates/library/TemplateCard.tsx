'use client';

import React from 'react';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: Template;
  mode?: 'view' | 'edit';
  onSelect?: (template: Template) => void;
  onDelete?: (template: Template) => void;
}

/**
 * TemplateCard 컴포넌트
 * 
 * 개별 템플릿을 표시하는 카드 컴포넌트
 * - Thumbnail 이미지 표시
 * - 템플릿 이름, 카테고리, 다운로드 카운트
 * - Published 상태 표시
 * - Edit/Delete 버튼 (edit mode)
 */
export function TemplateCard({
  template,
  mode = 'view',
  onSelect,
  onDelete,
}: TemplateCardProps) {
  const handleDelete = () => {
    if (onDelete && confirm(`${template.name} 템플릿을 삭제하시겠습니까?`)) {
      onDelete(template);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="p-0 overflow-hidden">
        <div className="relative aspect-video bg-gray-100">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🖼️</span>
            </div>
          )}
          
          {/* Published status indicator */}
          {template.isPublished && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-green-500 text-white">
                Published
              </Badge>
            </div>
          )}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TemplateCard;
