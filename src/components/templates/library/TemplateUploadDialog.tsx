'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Template } from '@/types/template';
import { TemplatePreview } from '../preview/TemplatePreview';
import { TemplateData } from '@/types/template';

interface TemplateUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    category: string;
    thumbnail: string;
  }) => Promise<void>;
}

/**
 * TemplateUploadDialog 컴포넌트
 * 
 * 새 템플릿 생성 다이얼로그
 * - 템플릿 이름, 카테고리, 썸네일 URL 입력
 * - 미리보기 기능
 * - 유효성 검사 및 에러 처리
 */
export function TemplateUploadDialog({
  open,
  onOpenChange,
  onSubmit,
}: TemplateUploadDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('wedding');
  const [thumbnail, setThumbnail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 목록
  const categories = ['wedding', 'birthday', 'custom'];

  // 유효성 검사
  const validateForm = (): boolean => {
    setError(null);

    if (!name.trim()) {
      setError('템플릿 이름을 입력해주세요');
      return false;
    }

    if (name.length < 1 || name.length > 255) {
      setError('템플릿 이름은 1-255 자이어야 합니다');
      return false;
    }

    if (!category) {
      setError('카테고리를 선택해주세요');
      return false;
    }

    if (!thumbnail.trim()) {
      setError('썸네일 URL 을 입력해주세요');
      return false;
    }

    // URL 형식 검사
    try {
      new URL(thumbnail);
    } catch {
      setError('유효한 URL 형식을 입력해주세요');
      return false;
    }

    return true;
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        category,
        thumbnail: thumbnail.trim(),
      });

      // 성공 후 초기화
      setName('');
      setCategory('wedding');
      setThumbnail('');
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '템플릿 생성에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 미리보기 데이터 생성
  const previewData: TemplateData = {
    templateId: 'preview',
    values: {},
    validate: () => true,
    getValue: () => null,
    setValue: () => {},
    getFieldNames: () => [],
  };

  // 미리보기 템플릿
  const previewTemplate: Template = {
    id: 'preview',
    userId: 'preview',
    name: name || '템플릿 이름',
    category,
    thumbnail: thumbnail || '',
    fields: [],
    layout: '',
    isPublished: false,
    downloadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 템플릿 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 템플릿 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">템플릿 이름 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 로맨틱 웨딩"
              disabled={isSubmitting}
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
              <SelectTrigger id="category">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'wedding' ? '웨딩' : cat === 'birthday' ? '생일' : '커스텀'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 썸네일 URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">썸네일 URL *</Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>

          {/* 미리보기 */}
          {thumbnail && (
            <div className="space-y-2">
              <Label>미리보기</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <TemplatePreview template={previewTemplate} data={previewData} />
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim() || !thumbnail.trim()}
            >
              {isSubmitting ? '생성 중...' : '생성하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateUploadDialog;
