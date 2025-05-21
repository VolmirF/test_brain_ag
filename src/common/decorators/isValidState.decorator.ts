import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidState(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidState',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `State is not valid`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return [
            'AC',
            'AL',
            'AP',
            'AM',
            'BA',
            'CE',
            'DF',
            'ES',
            'GO',
            'MA',
            'MT',
            'MS',
            'MG',
            'PA',
            'PB',
            'PR',
            'PE',
            'PI',
            'RJ',
            'RN',
            'RS',
            'RO',
            'RR',
            'SC',
            'SP',
            'SE',
            'TO',
          ].includes(value);
        },
      },
    });
  };
}
