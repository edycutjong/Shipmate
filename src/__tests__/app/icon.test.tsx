import React from 'react';
import { render } from '@testing-library/react';
import Icon, { size, contentType } from '@/app/icon';

jest.mock('next/og', () => ({
  ImageResponse: class {
    constructor(element: React.ReactElement, options: any) {
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
    const result = Icon() as any;
    expect(result.options).toEqual(size);
    expect(result.element).toBeTruthy();
  });
});
