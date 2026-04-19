import React from 'react';
import { render } from '@testing-library/react';
import AppleIcon, { size, contentType } from '@/app/apple-icon';

jest.mock('next/og', () => ({
  ImageResponse: class {
    constructor(element: React.ReactElement, options: any) {
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
    const result = AppleIcon() as any;
    expect(result.options).toEqual(size);
    expect(result.element).toBeTruthy();
  });
});
