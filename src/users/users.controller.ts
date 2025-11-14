import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiBearerAuth('jwt-auth')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('/register')
  async create(@Body() createUserDto: CreateUserDTO): Promise<UserEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  @Public()
  @Post('/login')
  async validateUser(
    @Body() loginCredential: LoginUserDTO,
  ): Promise<{ access_token }> {
    return await this.usersService.validateUser(loginCredential);
  }

  @Get(':username')
  async findOne(@Param() username: string): Promise<UserEntity | null> {
    return this.usersService.findOne(username);
  }
}
