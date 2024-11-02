import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class GetAllPostsDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize: number = 10;
}
