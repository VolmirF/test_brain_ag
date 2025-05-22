import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IsValidState } from '../../../common/decorators/isValidState.decorator';

export class GetProducersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (value + '').replace(/\D/g, ''))
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  @IsIn(['CNPJ', 'CPF'])
  documentType?: 'CNPJ' | 'CPF';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value + '').toUpperCase())
  @IsValidState()
  state?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  pageSize: number = 10;
}
