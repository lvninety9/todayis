'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { Template, TemplateData } from '@/types/template';
import { TemplateEngine } from '../engine/TemplateEngine';
import { Button } from '@/components/ui/button';

interface TemplatePreviewModalProps {
  template: Template;
  data: TemplateData;
  open: boolean;
  onClose: () => void;
}

/**
 * TemplatePreviewModal 컴포넌트
 * 
 * 템플릿 전체 화면 미리보기 모달
 * - Backdrop blur 배경
 * - 닫기 핸들러: X 버튼, backdrop 클릭, Escape 키
 * - 모바일: 전체 화면
 * - 데스크톱: max-width 600px 중앙 정렬
 */
export function TemplatePreviewModal({ template, data, open, onClose }: TemplatePreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal Content */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-[600px] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={onClose}
            variant="destructive"
            size="sm"
            className="w-10 h-10 rounded-full p-0 shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
            aria-label="닫기"
          >
            ✕
          </Button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto sm:rounded-2xl">
          <div className="min-h-full">
            <TemplateEngine template={template} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatePreviewModal;
