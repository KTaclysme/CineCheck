import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movies, UserRatings } from './entities/film.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Movies, 'movies') private moviesRepo: Repository<Movies>,
    @InjectRepository(UserRatings, 'user_rating') private userRatingsRepo: Repository<UserRatings>
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    const film = await this.moviesRepo.findOne ({
      where: {id: createFilmDto.tconst}
    });

    if(!film) {
      throw new Error("Film introuvable"); 
    }

    const userFilm = this.userRatingsRepo.create({
      tconst: createFilmDto.tconst,
      personalrating: createFilmDto.personalrating ?? null,
      watched: createFilmDto.watched ?? false,
      favorite: createFilmDto.favorite ?? false,
    })

    return this.userRatingsRepo.save(userFilm);
  }

  async findAll(page, limit) {
    const [data, total] = await this.moviesRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
  async findOne(id: string) {
    const film = await this.moviesRepo.findOne({
      where: { id }
    });

    if (!film) {
      throw new Error("Film introuvable");
    }

    return film;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
  await this.userRatingsRepo.update(id, updateFilmDto);
  
  return this.userRatingsRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
  const result = await this.userRatingsRepo.delete(id);
  
  if (result.affected === 0) {
    throw new Error(`Film avec l'ID ${id} introuvable`);
  }
  
  return {deleted: true}
  }
}
