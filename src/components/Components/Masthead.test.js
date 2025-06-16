import { render } from '@testing-library/react';
import { Masthead } from './Masthead';

describe('Masthead', () => {
  it('renders in dark mode', () => {
    const { container, getByText } = render(<Masthead />);

    expect(getByText('A NSW Government website')).toBeTruthy();
    expect(container.querySelector('.nsw-masthead')).toBeTruthy();
    expect(container.querySelector('.nsw-masthead--light')).toBeFalsy();
  });
  it('renders in dark mode when lightMode=false', () => {
    const { container, getByText } = render(<Masthead lightMode={false} />);

    expect(getByText('A NSW Government website')).toBeTruthy();
    expect(container.querySelector('.nsw-masthead')).toBeTruthy();
    expect(container.querySelector('.nsw-masthead--light')).toBeFalsy();
  });
  it('renders in light mode', () => {
    const { container, getByText } = render(<Masthead lightMode={true}/>);

    expect(getByText('A NSW Government website')).toBeTruthy();
    expect(container.querySelector('.nsw-masthead')).toBeTruthy();
    expect(container.querySelector('.nsw-masthead--light')).toBeTruthy();
  });
});
