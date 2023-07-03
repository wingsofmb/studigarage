import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export class ApiValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      this.logErrors(value, metadata, errors);
      throw new BadRequestException('Validation failed', { cause: errors });
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private logErrors(value: any, metadata: ArgumentMetadata, errors: ValidationError[]): void {
    console.error('\tFailed to validate input of ', metadata.metatype);
    errors.forEach((e: ValidationError) => {
      console.error('\t\t', this.getReadableError(e));
    });
    console.error('\tGiven input => ', value);
  }

  private getReadableError(e: ValidationError): string {
    const failedValidators = Object.keys(e.constraints);
    const output = failedValidators.map((key: string) => `${key} => ${e.constraints[key]}`);

    const childErrors = !e.children.length ? null : e.children.map((childError: ValidationError) => this.getReadableError(childError));
    const suffix = childErrors ? '\n\t\t\t' : '';
    return `${e.property} : ${output}${suffix}`;
  }
}
