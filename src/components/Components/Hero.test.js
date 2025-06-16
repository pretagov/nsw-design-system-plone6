import { render } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders with default options', () => {
    const { getByText } = render(<Hero title="My title" description="Description" />);

    expect(getByText('My title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
  });
});
