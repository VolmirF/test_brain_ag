import { Transform, Type } from 'class-transformer';
import { IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator';

import { IsValidState } from '../../../common/decorators/isValidState.decorator';

export class UpdatePropertyDto {
  @IsOptional()
  @IsNumber()
  producerId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value + '').toUpperCase())
  @IsValidState()
  state?: string;

  @Type(() => String)
  @IsOptional()
  @IsDecimal()
  farmArea?: string;

  @Type(() => String)
  @IsOptional()
  @IsDecimal()
  arableArea?: string;

  @Type(() => String)
  @IsOptional()
  @IsDecimal()
  vegetationArea?: string;
}
