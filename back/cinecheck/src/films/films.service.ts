import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { RateFilmDto } from './dto/rate-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movies, UserRatings } from './entities/film.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Movies, 'imdb')
    private moviesRepo: Repository<Movies>,

    @InjectRepository(UserRatings, 'cinecheck')
    private userRatingsRepo: Repository<UserRatings>,
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    const film = await this.moviesRepo.findOne({
      where: { id: createFilmDto.tconst },
    });

    if (!film) {
      throw new NotFoundException('Film introuvable');
    }

    const userFilm = this.userRatingsRepo.create({
      userid: createFilmDto.id,
      tconst: createFilmDto.tconst,
      personalrating: createFilmDto.personalrating ?? null,
      watched: createFilmDto.watched ?? false,
      favorite: createFilmDto.favorite ?? false,
    });

    return this.userRatingsRepo.save(userFilm);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const data = await this.moviesRepo.find({
      skip,
      take: limit,
      order: {
        votes: 'DESC',
      },
    });

    return {
      data,
      page,
      limit,
      hasMore: data.length === limit,
    };
  }

  async search(query: string, limit: number = 10) {
    if (!query.trim()) {
      return [];
    }

    return this.moviesRepo
      .createQueryBuilder('movie')
      .where('movie.title ILIKE :query', {
        query: `%${query.trim()}%`,
      })
      .orderBy('movie.votes', 'DESC')
      .take(limit)
      .getMany();
  }

  async findOne(id: string) {
    const film = await this.moviesRepo.findOne({
      where: { id },
    });

    if (!film) {
      throw new NotFoundException('Film introuvable');
    }

    return film;
  }

  async getUserRating(tconst: string, userId: number) {
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    const film = await this.moviesRepo.findOne({
      where: { id: tconst },
    });

    if (!film) {
      throw new NotFoundException('Film introuvable');
    }

    const rating = await this.userRatingsRepo.findOne({
      where: {
        userid: userId,
        tconst,
      },
    });

    return {
      movie: film,
      rating,
      hasRating: !!rating?.personalrating,
    };
  }

  async saveUserRating(req: any, rateFilmDto: RateFilmDto) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    const film = await this.moviesRepo.findOne({
      where: {
        id: rateFilmDto.tconst,
      },
    });

    if (!film) {
      throw new NotFoundException('Film introuvable');
    }

    let rating = await this.userRatingsRepo.findOne({
      where: {
        userid: userId,
        tconst: rateFilmDto.tconst,
      },
    });

    /*
     * Pas encore de notation
     * + une note envoyée
     */
    if (!rating && rateFilmDto.personalrating) {
      rating = this.userRatingsRepo.create({
        userid: userId,
        tconst: rateFilmDto.tconst,
        personalrating: rateFilmDto.personalrating,
        watched: true,
        favorite: false,
      });

      return this.userRatingsRepo.save(rating);
    }

    /*
     * Notation existante
     * + note envoyée
     *
     * => modification
     */
    if (rating && rateFilmDto.personalrating) {
      rating.personalrating = rateFilmDto.personalrating;
      rating.watched = true;

      return this.userRatingsRepo.save(rating);
    }

    /*
     * Notation existante
     * + note = 0 / null
     *
     * => suppression de la note
     */
    if (rating && !rateFilmDto.personalrating) {
      rating.personalrating = null;
      rating.watched = false;
      rating.favorite = false;

      return this.userRatingsRepo.save(rating);
    }

    /*
     * Aucun rating et aucune note
     */
    return null;
  }

  async removeUserRating(userId: number, tconst?: string) {
    if (!userId) {
      throw new UnauthorizedException(
        'Utilisateur non authentifié',
      );
    }

    const result = await this.userRatingsRepo.delete({
      userid: userId,
      ...(tconst && { tconst }),
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        'Film non trouvé ou déjà supprimé',
      );
    }

    return {
      deleted: true,
    };
  }

  async getUserRatings(userId: number) {
    if (!userId) {
      throw new UnauthorizedException(
        'Utilisateur non authentifié',
      );
    }

    const ratings = await this.userRatingsRepo.find({
      where: {
        userid: userId,
      },
      order: {
        id: 'DESC',
      },
    });

    const results = await Promise.all(
      ratings.map(async (rating) => {
        const movie = await this.moviesRepo.findOne({
          where: {
            id: rating.tconst,
          },
        });

        return {
          ...rating,
          movie,
        };
      }),
    );

    return results.filter((entry) => entry.movie);
  }

  async getMyRatings(userId: number) {
    if (!userId) {
      throw new UnauthorizedException(
        'Utilisateur non authentifié',
      );
    }

    const ratings = await this.userRatingsRepo.find({
      where: {
        userid: userId,
      },
    });

    const results = await Promise.all(
      ratings.map(async (rating) => {
        const movie = await this.moviesRepo.findOne({
          where: {
            id: rating.tconst,
          },
        });

        if (!movie) {
          return null;
        }

        return {
          ...movie,
          personalrating: rating.personalrating,
        };
      }),
    );

    return results.filter(Boolean);
  }

  async update(id: number, updateFilmDto: UpdateFilmDto) {
    await this.userRatingsRepo.update(
      id,
      updateFilmDto,
    );

    return this.userRatingsRepo.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    const result = await this.userRatingsRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Film avec l'ID ${id} introuvable`,
      );
    }

    return {
      deleted: true,
    };
  }
}