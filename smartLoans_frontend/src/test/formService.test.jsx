import { describe, it, expect } from 'vitest';
import { prepareFormData } from '../services/formService';

describe('prepareFormData', () => {
  it('should add all form fields correctly', () => {
    const formData = { name: 'John Doe', age: '30', email: 'john@example.com' };
    const files = {};
    
    const result = prepareFormData(formData, files);
    
    expect(result.get('name')).toBe('John Doe');
    expect(result.get('age')).toBe('30');
    expect(result.get('email')).toBe('john@example.com');
  });

  it('should add all files correctly', () => {
    const formData = {};
    const fileMock = new File(['dummy content'], 'dummy.pdf', { type: 'application/pdf' });
    const files = { document: fileMock };

    const result = prepareFormData(formData, files);

    expect(result.get('document')).toBe(fileMock);
  });

  it('should handle empty form fields', () => {
    const formData = {};
    const files = { document: new File(['test'], 'test.pdf', { type: 'application/pdf' }) };

    const result = prepareFormData(formData, files);

    expect(result.get('document')).toBeDefined();
    expect(result.get('name')).toBeNull(); // Should return null for missing key
  });

  it('should handle empty files', () => {
    const formData = { username: 'testUser' };
    const files = {};

    const result = prepareFormData(formData, files);

    expect(result.get('username')).toBe('testUser');
    expect(result.get('document')).toBeNull(); // Should return null for missing file
  });

  it('should handle both empty form fields and empty files', () => {
    const formData = {};
    const files = {};

    const result = prepareFormData(formData, files);

    expect(result.entries().next().done).toBe(true); // Should have no entries
  });
});
