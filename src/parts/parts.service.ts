import { Injectable } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartEntity } from './entities/parts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(PartEntity)
    private readonly partRepository: Repository<PartEntity>,
  ) {}
  create(createPartDto: CreatePartDto) {
    const part = this.partRepository.create(createPartDto);
    return this.partRepository.save(part);
  }

  async findAll() {
    return await this.partRepository.findOne({ where: { isActive: true } });
  }

  findOne(id: string) {
    return this.partRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    await this.partRepository.update(id, updatePartDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.partRepository.softDelete(id);
  }
}
