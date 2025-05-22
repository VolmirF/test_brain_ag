import { Transform, Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { IsGreaterThanEqual } from '../../../common/decorators/isGreaterThanEqual.decorator';
import { IsValidState } from '../../../common/decorators/isValidState.decorator';

export class CreatePropertyDto {
  @IsNumber()
  @IsNotEmpty()
  producerId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value + '').toUpperCase())
  @IsValidState()
  state: string;

  @Type(() => String)
  @IsDecimal()
  @IsNotEmpty()
  @IsGreaterThanEqual(['arableArea', 'vegetationArea'])
  farmArea: string;

  @Type(() => String)
  @IsDecimal()
  @IsNotEmpty()
  arableArea: string;

  @Type(() => String)
  @IsDecimal()
  @IsNotEmpty()
  vegetationArea: string;
}
