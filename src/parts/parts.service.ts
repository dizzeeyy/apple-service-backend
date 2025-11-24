import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    const skip = (page - 1) * limit;

    // Whitelist dozwolonych pól do sortowania (bezpieczeństwo)
    const allowedSortFields = ['name', 'price', 'type'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';

    const [parts, total] = await this.partRepository.findAndCount({
      where: { isActive: true },
      take: limit,
      skip: skip,
      order: { [sortField]: sortOrder }, // Dynamiczne sortowanie
    });

    return {
      data: parts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
      sorting: {
        sortBy: sortField,
        sortOrder,
      },
    };
  }

  async findOne(id: string) {
    const part = await this.partRepository.findOne({
      where: { id, isActive: true },
    });

    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }

    return part;
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    const part = await this.findOne(id);

    if (!part) {
      throw new NotFoundException();
    }

    Object.assign(part, updatePartDto);
    return await this.partRepository.save(part);
  }

  async remove(id: string) {
    const part = await this.findOne(id);

    if (!part) {
      throw new NotFoundException();
    }

    part.isActive = false;
    return await this.partRepository.save(part);
  }
}
