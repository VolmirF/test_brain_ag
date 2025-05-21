import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsGreaterThanEqual(
  property: string | number | string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message:
          typeof property === 'string' || typeof property === 'number'
            ? `The ${propertyName} should be greater than ${property}`
            : `The ${propertyName} should be greater than the sum of ${property.toString()}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedPropertyName = args.constraints[0] as
            | string
            | number
            | string[];

          if (value === undefined || value === null) return false;

          if (typeof relatedPropertyName === 'number') {
            return value >= relatedPropertyName;
          }
          if (typeof relatedPropertyName === 'string') {
            return value >= args.object[relatedPropertyName];
          }

          let sum = 0;
          for (const property of relatedPropertyName) {
            sum += args.object[property];
          }
          return value >= sum;
        },
      },
    });
  };
}
