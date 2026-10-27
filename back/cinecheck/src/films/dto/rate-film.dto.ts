import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class RateFilmDto {
  @IsString()
  @IsNotEmpty()
  tconst: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  personalrating?: number | null;
}