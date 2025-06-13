import { DocumentType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { IsValidDocument } from '../../../common/decorators/IsValidDocument.decorator';
import { IsValidState } from '../../../common/decorators/isValidState.decorator';

export class UpdateProducerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value + '').replace(/\D/g, ''))
  @IsValidDocument()
  document?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value + '').toUpperCase())
  @IsValidState()
  state?: string;

  @Expose()
  get documentType(): DocumentType | undefined {
    if (!this.document) return undefined;
    return this.document?.length === 11 ? 'CPF' : 'CNPJ';
  }
}
