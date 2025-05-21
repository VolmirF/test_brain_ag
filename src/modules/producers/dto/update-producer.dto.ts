import { DocumentType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { IsValidDocument } from 'src/common/decorators/IsValidDocument.decorator';

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
  state?: string;

  @Expose()
  get documentType(): DocumentType | undefined {
    if (!this.document) return undefined;
    return this.document?.length === 11 ? 'CPF' : 'CNPJ';
  }
}
