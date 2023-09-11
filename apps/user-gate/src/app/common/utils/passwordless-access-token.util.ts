import moment, { Moment } from 'moment';

import { generateRandomHash } from '@swiq/common/utils';

export const createPasswordlessToken = (): string => {
  return generateRandomHash();
};

export const getDateAheadOfOneYear = (): Moment => {
  const date = moment.utc(); // current date in UTC
  const datePlusOneYear = date.add(1, 'years');

  return datePlusOneYear;
};
