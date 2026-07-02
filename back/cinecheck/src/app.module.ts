import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { DatabasesModule } from './databases/databases.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, FilmsModule, DatabasesModule, AuthModule],
})
export class AppModule {}
