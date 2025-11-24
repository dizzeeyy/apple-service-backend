import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from 'src/users/dto/pagination.dto';
import { PaginationDtoLegacy } from 'src/common/dto/pagination.dto';

@UseGuards(RolesGuard)
@ApiBearerAuth('jwt-auth')
@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post()
  create(@Body() createPartDto: CreatePartDto) {
    return this.partsService.create(createPartDto);
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'name',
    description: 'Field to sort by (name, price, type)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    description: 'Sort direction',
  })
  findAll(@Query() paginationDto: PaginationDtoLegacy) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = paginationDto;

    return this.partsService.findAll(page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePartDto: UpdatePartDto,
  ) {
    return this.partsService.update(id, updatePartDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partsService.remove(id);
  }
}
