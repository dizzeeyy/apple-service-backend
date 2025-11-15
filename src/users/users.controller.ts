import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@ApiBearerAuth('jwt-auth')
@UseGuards(RolesGuard)
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

  @AdminOnly()
  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return await this.usersService.findAll(page, limit);
  }

  @Get(':username')
  async findOne(@Param() username: string): Promise<UserEntity | null> {
    return this.usersService.findOne(username);
  }
}
