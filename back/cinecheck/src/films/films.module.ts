import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinecheck, Film } from './entities/film.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film], 'imdb'),
    TypeOrmModule.forFeature([Cinecheck], 'cinecheck'),
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
