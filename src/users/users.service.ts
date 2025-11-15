import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDTO } from './dto/login-user.dto';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordService: AuthService,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

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
  ): Promise<{ access_token; userRole }> {
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
    return { ...token, userRole: user.role };
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
      data,
    };
  }

  async validateRole(username: string): Promise<boolean | null> {
    const user = await this.findOne(username);

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.role === 'owner') {
      return true;
    }
    return false;
  }
}
