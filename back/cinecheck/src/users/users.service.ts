import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, 'cinecheck') private usersRepo: Repository<Users>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Adresse mail déjà existante');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.pword, 10);
    const user = this.usersRepo.create({
      email: createUserDto.email,
      pword: hashedPassword,
    });
    return await this.usersRepo.save(user);
  }

  async findAll() {
    const users = await this.usersRepo.find()
    return users;
  }

  async findOne(email : string) {
    const user = await this.usersRepo.findOne({
      where: { email }
    })
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable')
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  const result = await this.usersRepo.update(id, updateUserDto);

  if (result.affected === 0) {
    throw new NotFoundException('Utilisateur inexistant');
  }

  return await this.usersRepo.findOne({
    where: { id }
  });
}

  async remove(id: number) {
    const user = await this.usersRepo.delete(id)
    return user;
  }
}
