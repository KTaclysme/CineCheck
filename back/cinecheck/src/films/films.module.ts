import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Castings, Movies, UserPersonRatings, UserRatings } from './entities/film.entity';
import { Users } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movies, Castings], 'imdb'),
    TypeOrmModule.forFeature([UserRatings, UserPersonRatings, Users], 'cinecheck'),
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
