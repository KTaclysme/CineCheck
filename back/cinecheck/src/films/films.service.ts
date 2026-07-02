import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film, Cinecheck } from './entities/film.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film, 'imdb') private imdbRepo: Repository<Film>,
    @InjectRepository(Cinecheck, 'cinecheck') private cinecheckRepo: Repository<Cinecheck>
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    const film = await this.imdbRepo.findOne ({
      where: {tconst: createFilmDto.tconst}
    });

    if(!film) {
      throw new Error("Film introuvable"); 
    }

    const userFilm = this.cinecheckRepo.create({
      tconst: createFilmDto.tconst,
      personalrating: createFilmDto.personalrating ?? null,
      watched: createFilmDto.watched ?? false,
      favorite: createFilmDto.favorite ?? false,
    })

    return this.cinecheckRepo.save(userFilm);
  }

  findAll() {
    return `This action returns all films`;
  }

  async findOne(tconst: string) {
    const film = await this.imdbRepo.findOne({
      where: { tconst }
    });

    if (!film) {
      throw new Error("Film introuvable");
    }

    return film;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
  await this.cinecheckRepo.update(id, updateFilmDto);
  
  return this.cinecheckRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
  const result = await this.cinecheckRepo.delete(id);
  
  if (result.affected === 0) {
    throw new Error(`Film avec l'ID ${id} introuvable`);
  }
  
  return {deleted: true}
  }
}
