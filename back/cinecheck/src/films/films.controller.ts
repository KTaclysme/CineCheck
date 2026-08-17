import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { RateFilmDto } from './dto/rate-film.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,) {
    return this.filmsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  // Récupérer la notation d'un utilisateur pour un film spécifique
  @Get(':tconst/user-rating')
  getUserRating(
    @Param('tconst') tconst: string, 
    @Query('userId', new DefaultValuePipe(null), ParseIntPipe) userId?: number | null
  ) {
    return this.filmsService.getUserRating(tconst, userId);
  }

  // Sauvegarder ou modifier une notation utilisateur
  @Post('rate')
  saveUserRating(@Request() req: any, @Body() rateFilmDto : RateFilmDto) {
    return this.filmsService.saveUserRating(req, rateFilmDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
    return this.filmsService.update(+id, updateFilmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmsService.remove(+id);
  }
}
