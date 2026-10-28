import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFilmDto {
  @IsString()
  tconst: string;

  @IsOptional()
  @IsNumber()
  personalrating?: number;

  @IsOptional()
  @IsBoolean()
  watched?: boolean;

  @IsOptional()
  @IsBoolean()
  favorite?: boolean;
}