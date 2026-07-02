import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cinecheck, Film } from 'src/films/entities/film.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      name : "imdb",
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('IMDB_HOST'),
        port: parseInt(configService.get('IMDB_PORT')),
        username: configService.get('IMDB_USER'),
        password: configService.get('IMDB_PASSWORD'),
        database: configService.get('IMDB_DB'),
        entities: [Film],
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      name : "cinecheck",
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('CINECHECK_HOST'),
        port: parseInt(configService.get('CINECHECK_PORT')),
        username: configService.get('CINECHECK_USER'),
        password: configService.get('CINECHECK_PASSWORD'),
        database: configService.get('CINECHECK_DB'),
        entities: [Cinecheck, User],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabasesModule {}   