import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const MatchesField =
  (field: string, validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      name: 'matchesField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [field],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedField] = args.constraints;
          return (
            value === (args.object as Record<string, unknown>)[relatedField]
          );
        },
      },
    });
  };
