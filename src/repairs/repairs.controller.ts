import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';

@UseGuards(RolesGuard)
@ApiBearerAuth('jwt-auth')
@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  @Post()
  create(@Body() createRepairDto: CreateRepairDto) {
    return this.repairsService.create(createRepairDto);
  }

  @AdminOnly()
  @Get()
  findAll() {
    return this.repairsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairDto: UpdateRepairDto) {
    return this.repairsService.update(id, updateRepairDto);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairsService.remove(id);
  }
}
