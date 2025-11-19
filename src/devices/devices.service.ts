import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DevicesEntity } from './entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(DevicesEntity)
    private readonly devicesRepository: Repository<DevicesEntity>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const device = await this.devicesRepository.create(createDeviceDto);

    return await this.devicesRepository.save(device);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.devicesRepository.findAndCount({
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

  async findOne(id: string) {
    return await this.devicesRepository.findOne({
      where: { id },
      relations: ['repair'],
    });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const device = await this.findOne(id);
    if (!device) {
      // obsłuż sytuację, gdy urządzenie nie istnieje, np. rzucając wyjątek
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    // tutaj wykonaj aktualizację (np. merge pól i zapisz)
    Object.assign(device, updateDeviceDto);
    return await this.devicesRepository.save(device);
  }

  async remove(id: string) {
    const device = await this.findOne(id);
    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    const deleted = await this.devicesRepository.delete(device.id);

    if (deleted) {
      return { status: 'deleted' };
    }
  }
}
