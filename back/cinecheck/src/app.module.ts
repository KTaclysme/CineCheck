import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [UsersModule, FilmsModule, RatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
