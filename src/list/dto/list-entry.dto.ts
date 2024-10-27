import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MediaType } from 'src/tmdb/types';

export class ListEntryDto {
  @IsNotEmpty()
  @IsNumber()
  mediaId: number;

  @IsNotEmpty()
  @IsString()
  mediaType: MediaType;
}
