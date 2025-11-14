import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDTO } from './dto/login-user.dto';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordService: AuthService,
  ) {}

  async findOne(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (user) {
      return user;
    }
    throw new NotFoundException('User not found.');
  }

  async createUser(createUserDto: CreateUserDTO): Promise<UserEntity> {
    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async validateUser(
    loginCredentials: LoginUserDTO,
  ): Promise<{ access_token }> {
    const user = await this.userRepository.findOne({
      where: { username: loginCredentials.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      loginCredentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }
    const token = await this.passwordService.generateToken(user);
    return token;
  }
}
