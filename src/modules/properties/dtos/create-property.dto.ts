import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  @IsGreaterThanEqual(['arableArea', 'vegetationArea'])
  farmArea: number;

  @IsNumber()
  @IsNotEmpty()
  arableArea: number;

  @IsNumber()
  @IsNotEmpty()
  vegetationArea: number;
}
