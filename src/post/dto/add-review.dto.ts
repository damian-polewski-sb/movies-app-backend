import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddReviewDto {
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;

  @IsOptional()
  @IsString()
  content?: string;
}
