import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCropDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
