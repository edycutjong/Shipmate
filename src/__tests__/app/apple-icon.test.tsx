import React from 'react';
import AppleIcon, { size, contentType } from '@/app/apple-icon';

jest.mock('next/og', () => ({
  ImageResponse: class {
    constructor(element: React.ReactElement, options: Record<string, unknown>) {
      return { element, options };
    }
  },
}));

describe('Apple Icon generated files', () => {
  it('should export correct size and content type', () => {
    expect(size).toEqual({ width: 180, height: 180 });
    expect(contentType).toBe('image/png');
  });

  it('should render ImageResponse with correct elements', () => {
    const result = AppleIcon() as unknown as { options: Record<string, unknown>; element: React.ReactElement };
    expect(result.options).toEqual(size);
    expect(result.element).toBeTruthy();
  });
});
