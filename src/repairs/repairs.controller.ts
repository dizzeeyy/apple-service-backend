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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { RepairStatus } from './entities/repair.entity';
import { UpdateStatusDto } from './dto/update-status.dto';
import { RepairsFormDto } from './dto/form-repair.dto';

@UseGuards(RolesGuard)
@ApiBearerAuth('jwt-auth')
@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  @Public()
  @Post()
  create(@Body() createRepairDto: CreateRepairDto) {
    return this.repairsService.create(createRepairDto);
  }

  @Public()
  @Post('/form')
  createMailForm(@Body() repairsFormDTO: RepairsFormDto) {
    return this.repairsService.createMailForm(repairsFormDTO);
  }

  @AdminOnly()
  @Get('/form/:jobId')
  getFormJobStatus(@Param('jobId') jobId: string) {
    return this.repairsService.getEmailJobStatus(jobId);
  }

  @AdminOnly()
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number = 0,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.repairsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairsService.findOne(id);
  }

  @Get('no/:number')
  findOneByNumber(@Param('number') number: string) {
    return this.repairsService.findOneByNumber(number);
  }

  @Get('sn/:serial')
  findBySerial(@Param('serial') serialNumber: string) {
    return this.repairsService.findBySerial(serialNumber);
  }

  @Patch('/status')
  updateStatus(@Body() updateStatusDTO: UpdateStatusDto) {
    return this.repairsService.updateStatus(
      updateStatusDTO.repairNumber,
      updateStatusDTO.status,
    );
  }

  @Post('/search')
  searchRepairs(@Body() body: { repairNumber: string; serialNumber: string }) {
    return this.repairsService.searchRepairs(
      body.repairNumber,
      body.serialNumber,
    );
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
