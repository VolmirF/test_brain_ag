import { registerDecorator, ValidationOptions } from 'class-validator';
import { isCPFOrCNPJ } from 'brazilian-values';

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidDocument',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `The document provided in '${propertyName}' is invalid`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isCPFOrCNPJ(value);
        },
      },
    });
  };
}
