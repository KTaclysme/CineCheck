import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'cinecheck') private userRepo: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepo.create(createUserDto)
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email}
    });
    if (existingUser) {
      throw new Error('Adresse mail déjà existant')
    }
    return await this.userRepo.save(user);
  }

  async findAll() {
    const users = await this.userRepo.find()
    return users;
  }

  async findOne(email : string) {
    const user = await this.userRepo.findOne({
      where: { email }
    })
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable')
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  const result = await this.userRepo.update(id, updateUserDto);

  if (result.affected === 0) {
    throw new NotFoundException('Utilisateur inexistant');
  }

  return await this.userRepo.findOne({
    where: { id }
  });
}

  async remove(id: number) {
    const user = await this.userRepo.delete(id)
    return user;
  }
}
