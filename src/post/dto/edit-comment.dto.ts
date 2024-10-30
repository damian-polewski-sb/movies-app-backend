import { IsString, IsOptional } from 'class-validator';

export class EditCommentDto {
  @IsString()
  @IsOptional()
  content?: string;
}
