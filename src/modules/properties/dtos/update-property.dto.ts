import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  state: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  farmArea: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  arableArea: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  vegetationArea: number;
}
