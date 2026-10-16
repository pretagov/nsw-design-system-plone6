import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';
import {
  nswSiteSettingsFromComponent,
  subfooterFromComponent,
  withContentExpander,
} from './contentExpanders';

const reducer = (state = { result: null }, action = {}) =>
  action.type === 'GET_THING_SUCCESS' ? { result: action.result } : state;

const contentSuccess = (components, extra = {}) => ({
  type: `${GET_CONTENT}_SUCCESS`,
  result: { '@id': 'http://localhost/page', '@components': components },
  ...extra,
});

describe('withContentExpander', () => {
  const wrapped = withContentExpander(reducer, 'thing', 'GET_THING');

  it('fills the state from the expanded component', () => {
    const thing = { '@id': 'http://localhost/@thing', title: 'Site' };
    expect(wrapped(undefined, contentSuccess({ thing }))).toEqual({
      result: thing,
    });
  });

  it('ignores a component that is only its @id', () => {
    const state = { result: 'before' };
    const action = contentSuccess({
      thing: { '@id': 'http://localhost/@thing' },
    });
    expect(wrapped(state, action)).toBe(state);
  });

  it('ignores content without the component', () => {
    const state = { result: 'before' };
    expect(wrapped(state, contentSuccess({}))).toBe(state);
  });

  it('ignores subrequests', () => {
    const state = { result: 'before' };
    const action = contentSuccess(
      { thing: { '@id': 'x', title: 'Other' } },
      { subrequest: 'listing' },
    );
    expect(wrapped(state, action)).toBe(state);
  });

  it('still handles its own actions', () => {
    expect(
      wrapped(undefined, { type: 'GET_THING_SUCCESS', result: 'direct' }),
    ).toEqual({ result: 'direct' });
  });

  it('converts the component with toResult', () => {
    const items = withContentExpander(
      reducer,
      'subfooter',
      'GET_THING',
      subfooterFromComponent,
    );
    const subfooter = { '@id': 'x', items: [{ rootPath: '/' }] };
    expect(items(undefined, contentSuccess({ subfooter }))).toEqual({
      result: [{ rootPath: '/' }],
    });
  });
});

describe('component conversions', () => {
  it('drops the @id from nswSiteSettings', () => {
    expect(
      nswSiteSettingsFromComponent({ '@id': 'x', breadcrumb_start_depth: 2 }),
    ).toEqual({ breadcrumb_start_depth: 2 });
  });

  it('returns the subfooter items, or an empty list', () => {
    expect(subfooterFromComponent({ '@id': 'x', items: [1] })).toEqual([1]);
    expect(subfooterFromComponent({ '@id': 'x' })).toEqual([]);
  });
});
