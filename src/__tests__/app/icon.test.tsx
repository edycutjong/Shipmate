import React from 'react';
import Icon, { size, contentType } from '@/app/icon';

jest.mock('next/og', () => ({
  ImageResponse: class {
    constructor(element: React.ReactElement, options: Record<string, unknown>) {
      return { element, options };
    }
  },
}));

describe('Icon generated files', () => {
  it('should export correct size and content type', () => {
    expect(size).toEqual({ width: 48, height: 48 });
    expect(contentType).toBe('image/png');
  });

  it('should render ImageResponse with correct elements', () => {
    const result = Icon() as unknown as { options: Record<string, unknown>; element: React.ReactElement };
    expect(result.options).toEqual(size);
    expect(result.element).toBeTruthy();
  });
});
