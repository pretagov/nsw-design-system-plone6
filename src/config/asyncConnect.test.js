import { updateAsyncItems } from './asyncConnect';

const store = (token) => ({
  getState: () => ({ userSession: { token } }),
});

describe('updateAsyncItems', () => {
  const workflow = jest.fn(() => 'fetched');
  const items = [
    { key: 'content', promise: () => 'content' },
    { key: 'siteInfo', promise: () => 'siteinfo' },
    { key: 'subfooter', promise: () => 'subfooter' },
    { key: 'workflow', promise: workflow },
  ];

  beforeEach(() => workflow.mockClear());

  it('drops the fetches that the content expansion replaces', () => {
    expect(updateAsyncItems(items).map((item) => item.key)).toEqual([
      'content',
      'workflow',
    ]);
  });

  it('skips @workflow for anonymous users', () => {
    const item = updateAsyncItems(items).find(({ key }) => key === 'workflow');
    expect(item.promise({ store: store(null) })).toBeUndefined();
    expect(workflow).not.toHaveBeenCalled();
  });

  it('fetches @workflow for logged-in users', () => {
    const item = updateAsyncItems(items).find(({ key }) => key === 'workflow');
    const options = { store: store('a-token') };
    expect(item.promise(options)).toBe('fetched');
    expect(workflow).toHaveBeenCalledWith(options);
  });
});
