import { DocumentType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { IsValidDocument } from 'src/common/decorators/IsValidDocument.decorator';

export class CreateProducerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value + '').replace(/\D/g, ''))
  @IsValidDocument()
  document: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @Expose()
  get documentType(): DocumentType {
    return this.document.length === 11 ? 'CPF' : 'CNPJ';
  }
}
