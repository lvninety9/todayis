'use client';

import React, { useState, useMemo } from 'react';
import { Template } from '@/types/template';
import { TemplateCard } from './TemplateCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface TemplateLibraryProps {
  templates: Template[];
  mode?: 'view' | 'edit';
  onSelect?: (template: Template) => void;
  onDelete?: (template: Template) => void;
  onCreate?: () => void;
  onFilter?: (category: string) => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
}

/**
 * TemplateLibrary 컴포넌트
 * 
 * 템플릿 라이브러리 그리드 레이아웃
 * - TemplateCard 컴포넌트 사용
 * - 카테고리 필터, 검색 기능
 * - 로딩 상태, 빈 상태 처리
 * - 정렬 기능 (이름, 날짜, 다운로드)
 */
export function TemplateLibrary({
  templates,
  mode = 'view',
  onSelect,
  onDelete,
  onCreate,
  onFilter,
  onSearch,
  loading = false,
}: TemplateLibraryProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'downloads'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [templates]);

  // 필터링 및 정렬
  const filteredAndSortedTemplates = useMemo(() => {
    let result = [...templates];

    // 필터링
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(query));
    }

    // 정렬
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'downloads':
          comparison = a.downloadCount - b.downloadCount;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [templates, filterCategory, searchQuery, sortBy, sortOrder]);

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    setFilterCategory(value);
    if (onFilter) {
      onFilter(value === 'all' ? '' : value);
    }
  };

  // 검색 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // 정렬 변경 핸들러
  const handleSortChange = (value: string) => {
    const newSortBy = value as 'name' | 'date' | 'downloads';
    setSortBy(newSortBy);
    
    // 기본값: 날짜는 내림차순, 나머지는 오름차순
    if (newSortBy === 'date' || newSortBy === 'downloads') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // 빈 상태
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold mb-2">템플릿이 없습니다</h3>
        <p className="text-gray-500 mb-6">새로운 템플릿을 만들어보세요</p>
        {onCreate && (
          <Button onClick={onCreate} variant="default">
            + 새 템플릿 만들기
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 영역 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 입력 */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="템플릿 이름으로 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        {/* 카테고리 필터 */}
        <Select value={filterCategory} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? '전체' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 정렬 */}
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">이름</SelectItem>
            <SelectItem value="date">날짜</SelectItem>
            <SelectItem value="downloads">다운로드</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            mode={mode}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* 결과 카운트 */}
      <div className="text-sm text-gray-500">
        {filteredAndSortedTemplates.length}개 중 {filteredAndSortedTemplates.length}개 표시
        {filterCategory !== 'all' && ` (${filterCategory})`}
        {searchQuery && ` - 검색: "${searchQuery}"`}
      </div>
    </div>
  );
}

export default TemplateLibrary;
