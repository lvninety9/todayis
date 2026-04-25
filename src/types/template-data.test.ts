import { describe, it, expect } from 'vitest';
import type { TemplateData, TemplateField, FieldType } from '@/types/template';

describe('TemplateData', () => {
  it('accepts valid TemplateData structure', () => {
    const data: TemplateData = {
      templateId: 'template-123',
      values: { bride_name: 'jay', groom_name: 'partner' },
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue() {},
      getFieldNames() {
        return [];
      },
    };
    expect(data.templateId).toBe('template-123');
    expect(data.values).toEqual({ bride_name: 'jay', groom_name: 'partner' });
  });

  it('accepts empty values Record', () => {
    const data: TemplateData = {
      templateId: 'template-123',
      values: {},
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue() {},
      getFieldNames() {
        return [];
      },
    };
    expect(data.values).toEqual({});
  });

  it('accepts all FieldType keys in values', () => {
    const fields: FieldType[] = ['text', 'date', 'image', 'location'];
    const data: TemplateData = {
      templateId: 'template-123',
      values: {},
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue() {},
      getFieldNames() {
        return fields.map((f) => f);
      },
    };
    const names = data.getFieldNames();
    expect(names).toEqual(fields);
  });

  it('values is Record<string, string> — accepts string values only', () => {
    const data: TemplateData = {
      templateId: 'template-123',
      values: {
        bride_name: 'jay',
        groom_name: 'partner',
        wedding_date: '2024-06-01',
        venue: 'Seoul',
      },
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue() {},
      getFieldNames() {
        return [];
      },
    };
    for (const value of Object.values(data.values)) {
      expect(typeof value).toBe('string');
    }
  });

  it('validate() returns boolean', () => {
    const data: TemplateData = {
      templateId: 'template-123',
      values: {},
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue() {},
      getFieldNames() {
        return [];
      },
    };
    const result = data.validate();
    expect(typeof result).toBe('boolean');
  });

  it('getValue() returns string | null', () => {
    const data: TemplateData = {
      templateId: 'template-123',
      values: { name: 'jay' },
      validate() {
        return true;
      },
      getValue(fieldName: string) {
        return this.values[fieldName] ?? null;
      },
      setValue() {},
      getFieldNames() {
        return [];
      },
    };
    expect(data.getValue('name')).toBe('jay');
    expect(data.getValue('missing')).toBeNull();
  });

  it('setValue() updates values', () => {
    const data: TemplateData = {
      templateId: 'template-123',
      values: { name: 'initial' },
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue(fieldName: string, value: string) {
        this.values[fieldName] = value;
      },
      getFieldNames() {
        return [];
      },
    };
    data.setValue('name', 'updated');
    expect(data.values.name).toBe('updated');
  });

  it('getFieldNames() returns string array', () => {
    const fieldNames = ['bride_name', 'groom_name', 'wedding_date', 'venue'];
    const data: TemplateData = {
      templateId: 'template-123',
      values: {},
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue() {},
      getFieldNames() {
        return fieldNames;
      },
    };
    const names = data.getFieldNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names).toEqual(fieldNames);
  });

  it('templateId is a non-empty string', () => {
    const data: TemplateData = {
      templateId: 'template-123',
      values: {},
      validate() {
        return true;
      },
      getValue() {
        return null;
      },
      setValue() {},
      getFieldNames() {
        return [];
      },
    };
    expect(typeof data.templateId).toBe('string');
    expect(data.templateId.length).toBeGreaterThan(0);
  });
});

describe('TemplateField', () => {
  it('accepts all FieldType values', () => {
    const fields: TemplateField[] = [
      { name: 'bride_name', type: 'text', label: '신부 이름', required: true, defaultValue: null },
      { name: 'wedding_date', type: 'date', label: '결혼식 날짜', required: true, defaultValue: null },
      { name: 'venue', type: 'location', label: '장소', required: true, defaultValue: null },
      { name: 'photo', type: 'image', label: '사진', required: false, defaultValue: null },
    ];
    for (const field of fields) {
      expect(['text', 'date', 'image', 'location']).toContain(field.type);
    }
  });

  it('accepts required and optional fields', () => {
    const required: TemplateField = {
      name: 'required_field',
      type: 'text',
      label: '필수',
      required: true,
      defaultValue: null,
    };
    const optional: TemplateField = {
      name: 'optional_field',
      type: 'text',
      label: '선택',
      required: false,
      defaultValue: 'default',
    };
    expect(required.required).toBe(true);
    expect(optional.required).toBe(false);
    expect(optional.defaultValue).toBe('default');
  });

  it('defaultValue can be null', () => {
    const field: TemplateField = {
      name: 'no_default',
      type: 'text',
      label: '기본값 없음',
      required: false,
      defaultValue: null,
    };
    expect(field.defaultValue).toBeNull();
  });
});

describe('Template', () => {
  it('accepts valid Template structure', () => {
    const template = {
      id: 'template-123',
      name: '기본 템플릿',
      category: 'basic',
      thumbnail: 'https://example.com/thumb.jpg',
      fields: [
        { name: 'bride_name', type: 'text', label: '신부 이름', required: true, defaultValue: null },
      ],
      layout: '{"type":"grid"}',
      userId: 'user-123',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isPublished: false,
      downloadCount: 0,
    };
    expect(template.id).toBe('template-123');
    expect(template.fields).toHaveLength(1);
    expect(template.downloadCount).toBe(0);
  });

  it('isPublished defaults to false', () => {
    const template = {
      id: 'template-123',
      name: '기본 템플릿',
      category: 'basic',
      thumbnail: 'https://example.com/thumb.jpg',
      fields: [],
      layout: '{}',
      userId: 'user-123',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isPublished: false,
      downloadCount: 0,
    };
    expect(template.isPublished).toBe(false);
  });

  it('downloadCount is a number', () => {
    const template = {
      id: 'template-123',
      name: '기본 템플릿',
      category: 'basic',
      thumbnail: 'https://example.com/thumb.jpg',
      fields: [],
      layout: '{}',
      userId: 'user-123',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isPublished: false,
      downloadCount: 42,
    };
    expect(typeof template.downloadCount).toBe('number');
    expect(template.downloadCount).toBe(42);
  });
});
