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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
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
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDTO): Promise<UserEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  @Public()
  @Post('/login')
  @ApiOkResponse({
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      userRole: 'user',
    },
  })
  async validateUser(
    @Body() loginCredential: LoginUserDTO,
  ): Promise<{ access_token }> {
    return await this.usersService.validateUser(loginCredential);
  }

  @AdminOnly()
  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getAll(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return await this.usersService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity | null> {
    return this.usersService.findOne(id);
  }

  @Get('/username/:id')
  async findOneByUsername(@Param('id') id: string): Promise<UserEntity | null> {
    return this.usersService.findOneByUsername(id);
  }
}
