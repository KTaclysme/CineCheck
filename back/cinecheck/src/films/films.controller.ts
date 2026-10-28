import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { RateFilmDto } from './dto/rate-film.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,) {
    return this.filmsService.findAll(page, limit);
  }

  
  @UseGuards(AuthGuard)
  @Get('my-ratings')
  getMyRatings(@Request() req: any) {
    return this.filmsService.getMyRatings(req.user?.id);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }
  
  @UseGuards(AuthGuard)
  @Get(':tconst/user-rating')
  getUserRating(
    @Request() req: any,
    @Param('tconst') tconst: string,
  ) {
    return this.filmsService.getUserRating(tconst, req.user?.id);
  }

  @UseGuards(AuthGuard)
  @Post('rate')
  saveUserRating(@Request() req: any, @Body() rateFilmDto : RateFilmDto) {
    return this.filmsService.saveUserRating(req, rateFilmDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
    return this.filmsService.update(+id, updateFilmDto);
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmsService.remove(+id);
  }
}
