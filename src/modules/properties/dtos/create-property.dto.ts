import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { IsGreaterThanEqual } from 'src/common/decorators/isGreaterThanEqual.decorator';

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
