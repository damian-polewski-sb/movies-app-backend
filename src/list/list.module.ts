import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [MovieModule],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService],
})
export class ListModule {}
