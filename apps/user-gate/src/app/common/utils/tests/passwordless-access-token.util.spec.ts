import MockDate from 'mockdate';

import { getDateAheadOfOneYear } from '@common/utils';

describe('PasswordlessAccessTokenUtils', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getDateAheadOfOneYear', () => {
    it('returns the date one year ahead of the current date', () => {
      MockDate.set('2023-06-12T00:00:00.000Z');

      const result = getDateAheadOfOneYear();

      expect(result.toISOString()).toBe('2024-06-12T00:00:00.000Z');
    });
  });
});
