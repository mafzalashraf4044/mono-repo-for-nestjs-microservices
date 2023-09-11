import {
  registerDecorator,
  ValidationOptions,
  buildMessage,
} from 'class-validator';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js/max';

export const isPhoneNumber = (
  value: string,
  regions?: CountryCode[],
): boolean => {
  if (value.trim() !== value) {
    return false;
  }

  try {
    const phoneNumber = parsePhoneNumber(value);

    /**
     * We fail the validation if the user provided a regions
     * and it doesn't contain the country code of the parsed number.
     **/
    if (regions && regions.indexOf(phoneNumber.country) === -1) {
      return false;
    }

    return phoneNumber.isValid();
  } catch (error) {
    return false;
  }
};

export const IsMultiRegionPhoneNumber = (
  regions: CountryCode[],
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsMultiRegionPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value, args): boolean => isPhoneNumber(value, regions),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid phone number',
          validationOptions,
        ),
      },
    });
  };
};
