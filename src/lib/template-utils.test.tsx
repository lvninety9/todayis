import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateTemplateData, getDefaultValue, renderField } from '@/lib/template-utils';
import { TemplateField } from '@/types/template';

// Mock React.createElement for renderField tests
vi.mock('react', () => ({
  createElement: (tag: string, props: Record<string, unknown>, ...children: unknown[]) => ({
    type: tag,
    props: props || {},
    children,
  }),
  span: (props: Record<string, unknown>, ...children: unknown[]) => ({
    type: 'span',
    props: props || {},
    children,
  }),
  img: (props: Record<string, unknown>) => ({
    type: 'img',
    props: props || {},
    children: [],
  }),
  div: (props: Record<string, unknown>, ...children: unknown[]) => ({
    type: 'div',
    props: props || {},
    children,
  }),
  a: (props: Record<string, unknown>, ...children: unknown[]) => ({
    type: 'a',
    props: props || {},
    children,
  }),
}));

const createField = (overrides: Partial<TemplateField> = {}): TemplateField => ({
  name: 'test_field',
  type: 'text',
  label: 'Test Field',
  required: false,
  defaultValue: 'default',
  ...overrides,
});

describe('validateTemplateData', () => {
  const fields = [
    createField({ name: 'required_field', required: true }),
    createField({ name: 'optional_field', required: false }),
  ];

  it('returns true when all required fields have values', () => {
    const data = {
      templateId: '1',
      values: { required_field: 'value', optional_field: '' },
      validate: () => true,
      getValue: (name: string) => name === 'required_field' ? 'value' : '',
      setValue: () => {},
      getFieldNames: () => ['required_field', 'optional_field'],
    };
    expect(validateTemplateData(data, fields)).toBe(true);
  });

  it('returns false when a required field is empty', () => {
    const data = {
      templateId: '1',
      values: { required_field: '', optional_field: 'value' },
      validate: () => true,
      getValue: (name: string) => name === 'required_field' ? '' : 'value',
      setValue: () => {},
      getFieldNames: () => ['required_field', 'optional_field'],
    };
    expect(validateTemplateData(data, fields)).toBe(false);
  });

  it('returns false when a required field is null', () => {
    const data = {
      templateId: '1',
      values: { required_field: null as unknown as string, optional_field: 'value' },
      validate: () => true,
      getValue: (name: string) => name === 'required_field' ? null : 'value',
      setValue: () => {},
      getFieldNames: () => ['required_field', 'optional_field'],
    };
    expect(validateTemplateData(data, fields)).toBe(false);
  });

  it('returns false when a required field is whitespace only', () => {
    const data = {
      templateId: '1',
      values: { required_field: '   ', optional_field: 'value' },
      validate: () => true,
      getValue: (name: string) => name === 'required_field' ? '   ' : 'value',
      setValue: () => {},
      getFieldNames: () => ['required_field', 'optional_field'],
    };
    expect(validateTemplateData(data, fields)).toBe(false);
  });

  it('returns true when only optional fields are empty', () => {
    const data = {
      templateId: '1',
      values: { required_field: 'value', optional_field: '' },
      validate: () => true,
      getValue: (name: string) => name === 'required_field' ? 'value' : '',
      setValue: () => {},
      getFieldNames: () => ['required_field', 'optional_field'],
    };
    expect(validateTemplateData(data, fields)).toBe(true);
  });
});

describe('getDefaultValue', () => {
  const field = createField({ defaultValue: 'fallback' });

  it('returns the value when it is a non-empty string', () => {
    expect(getDefaultValue('hello', field)).toBe('hello');
  });

  it('returns the defaultValue when value is null', () => {
    expect(getDefaultValue(null, field)).toBe('fallback');
  });

  it('returns the defaultValue when value is empty string', () => {
    expect(getDefaultValue('', field)).toBe('fallback');
  });

  it('returns empty string when value is empty and defaultValue is null', () => {
    const fieldNoDefault = createField({ defaultValue: null });
    expect(getDefaultValue('', fieldNoDefault)).toBe('');
  });
});

describe('renderField', () => {
  it('renders text type as span', () => {
    const result = renderField('Hello', 'text');
    expect(result).toHaveProperty('type', 'span');
  });

  it('renders date type with Korean format', () => {
    const result = renderField('2024-12-25', 'date');
    expect(result).toHaveProperty('type', 'span');
  });

  it('renders invalid date as plain text', () => {
    const result = renderField('not-a-date', 'date');
    expect(result).toHaveProperty('type', 'span');
  });

  it('renders image type as img tag', () => {
    const result = renderField('https://example.com/photo.jpg', 'image');
    expect(result).toHaveProperty('type', 'img');
  });

  it('renders location type with map link', () => {
    const result = renderField('Seoul Station', 'location');
    expect(result).toHaveProperty('type', 'div');
  });

  it('renders unknown type as span', () => {
    const result = renderField('unknown', 'unknown');
    expect(result).toHaveProperty('type', 'span');
  });
});
