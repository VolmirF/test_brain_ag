import { Transform, Type } from 'class-transformer';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsValidState } from 'src/common/decorators/isValidState.decorator';

export class UpdatePropertyDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  producerId: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => (value + '').toUpperCase())
  @IsValidState()
  state: string;

  @Type(() => String)
  @IsDecimal()
  @IsNotEmpty()
  @IsOptional()
  farmArea: string;

  @Type(() => String)
  @IsDecimal()
  @IsNotEmpty()
  @IsOptional()
  arableArea: string;

  @Type(() => String)
  @IsDecimal()
  @IsNotEmpty()
  @IsOptional()
  vegetationArea: string;
}
