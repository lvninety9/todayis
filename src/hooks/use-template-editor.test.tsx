import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTemplateEditor } from '@/hooks/use-template-editor';
import type { Template } from '@/types/template';

const mockTemplate: Template = {
  id: 'template-123',
  name: 'Test Template',
  category: 'basic',
  thumbnail: 'https://example.com/thumb.jpg',
  fields: [
    { name: 'bride_name', type: 'text', label: '신부 이름', required: true, defaultValue: '' },
    { name: 'groom_name', type: 'text', label: '신랑 이름', required: true, defaultValue: '' },
    { name: 'wedding_date', type: 'date', label: '결혼식 날짜', required: true, defaultValue: '' },
    { name: 'venue', type: 'location', label: '장소', required: false, defaultValue: '성신여대 백주년기념관' },
  ],
  layout: '{"type":"grid"}',
  userId: 'user-123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  isPublished: false,
  downloadCount: 0,
  price: 0,
  isPurchased: false,
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

describe('useTemplateEditor', () => {
  it('initializes with default values from template fields', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    expect(result.current.data.bride_name).toBe('');
    expect(result.current.data.groom_name).toBe('');
    expect(result.current.data.wedding_date).toBe('');
    expect(result.current.data.venue).toBe('성신여대 백주년기념관');
  });

  it('returns empty string for fields without defaultValue', () => {
    const templateWithNoDefaults: Template = {
      ...mockTemplate,
      fields: [
        { name: 'name', type: 'text', label: '이름', required: false, defaultValue: null },
      ],
    };
    const { result } = renderHook(() => useTemplateEditor({ template: templateWithNoDefaults }), { wrapper: Wrapper });

    expect(result.current.data.name).toBe('');
  });

  it('updates field value via updateField', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('bride_name', 'jay');
    });

    expect(result.current.data.bride_name).toBe('jay');
  });

  it('updates multiple fields independently', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('bride_name', 'jay');
      result.current.updateField('groom_name', 'partner');
    });

    expect(result.current.data.bride_name).toBe('jay');
    expect(result.current.data.groom_name).toBe('partner');
  });

  it('shows error for required field with empty value', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('bride_name', '');
    });

    const errors = result.current.getErrors();
    expect(errors.bride_name).toBe('신부 이름은(는) 필수입니다');
  });

  it('shows error for required field with whitespace-only value', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('bride_name', '   ');
    });

    const errors = result.current.getErrors();
    expect(errors.bride_name).toBe('신부 이름은(는) 필수입니다');
  });

  it('clears error when valid value is entered', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('bride_name', 'jay');
    });

    const errors = result.current.getErrors();
    expect(errors.bride_name).toBeUndefined();
  });

  it('validates date field for invalid dates', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('wedding_date', 'not-a-date');
    });

    const errors = result.current.getErrors();
    expect(errors.wedding_date).toBe('유효한 날짜를 입력해주세요');
  });

  it('accepts valid date without error', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('wedding_date', '2024-06-01');
    });

    const errors = result.current.getErrors();
    expect(errors.wedding_date).toBeUndefined();
  });

  it('validateAll returns true when all required fields are filled', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('bride_name', 'jay');
      result.current.updateField('groom_name', 'partner');
      result.current.updateField('wedding_date', '2024-06-01');
    });

    const valid = result.current.validateAll();
    expect(valid).toBe(true);
  });

  it('validateAll returns false when required fields are empty', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    const valid = result.current.validateAll();
    expect(valid).toBe(false);
  });

  it('validateAll sets errors for all invalid fields', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.validateAll();
    });
    const errors = result.current.getErrors();

    expect(errors.bride_name).toBe('신부 이름은(는) 필수입니다');
    expect(errors.groom_name).toBe('신랑 이름은(는) 필수입니다');
    expect(errors.wedding_date).toBe('결혼식 날짜은(는) 필수입니다');
  });

  it('getData returns TemplateData object', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    act(() => {
      result.current.updateField('bride_name', 'jay');
      result.current.updateField('groom_name', 'partner');
    });

    const templateData = result.current.getData();
    expect(templateData.templateId).toBe('template-123');
    expect(templateData.getValue('bride_name')).toBe('jay');
    expect(templateData.getValue('groom_name')).toBe('partner');
  });

  it('getData returns empty string for unfilled fields', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    const templateData = result.current.getData();
    expect(templateData.getValue('bride_name')).toBe('');
  });

  it('getData.getFieldNames returns all field names', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    const templateData = result.current.getData();
    const fieldNames = templateData.getFieldNames();

    expect(fieldNames).toContain('bride_name');
    expect(fieldNames).toContain('groom_name');
    expect(fieldNames).toContain('wedding_date');
    expect(fieldNames).toContain('venue');
    expect(fieldNames).toHaveLength(4);
  });

  it('getData.setValue updates internal values', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    const templateData = result.current.getData();
    templateData.setValue('bride_name', 'updated');
    expect(templateData.getValue('bride_name')).toBe('updated');
  });

  it('getData.validate() returns boolean', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    const templateData = result.current.getData();
    const valid = templateData.validate();
    expect(typeof valid).toBe('boolean');
  });

  it('errors state is separate from data state', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    expect(result.current.errors).toEqual({});
    expect(result.current.data).toHaveProperty('bride_name');
  });

  it('returns all expected methods and state', () => {
    const { result } = renderHook(() => useTemplateEditor({ template: mockTemplate }), { wrapper: Wrapper });

    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('errors');
    expect(result.current).toHaveProperty('updateField');
    expect(result.current).toHaveProperty('validateAll');
    expect(result.current).toHaveProperty('getErrors');
    expect(result.current).toHaveProperty('getData');
  });
});
