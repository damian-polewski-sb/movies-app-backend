import { MediaType } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ListEntryDto {
  @IsNotEmpty()
  @IsNumber()
  mediaId: number;

  @IsNotEmpty()
  @IsString()
  mediaType: MediaType;
}
