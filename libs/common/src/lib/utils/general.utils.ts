import * as moment from 'moment';

// Generates a random 6-digit number and turn to string
export function getRandomSixDigitString(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generates a date in utc format one hour from now
export function getUtcDateOneHourFromNow(): string {
  const utcOneHourFromNow = moment.utc().add(1, 'hour');
  return utcOneHourFromNow.format();
}

// compare the current date with the date in utc sent in an argument return true if the incoming date is less
export function compareDateWithUtc(date: string): boolean {
  const currentDate = moment.utc();
  const expirationDate = moment.utc(date);
  return currentDate.isBefore(expirationDate);
}
