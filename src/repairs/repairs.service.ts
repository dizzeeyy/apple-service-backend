import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairEntity, RepairStatus } from './entities/repair.entity';
import { Repository } from 'typeorm';
import { DevicesEntity } from 'src/devices/entities/device.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { DevicesService } from 'src/devices/devices.service';

@Injectable()
export class RepairsService {
  constructor(
    @InjectRepository(RepairEntity)
    private readonly repairRepository: Repository<RepairEntity>,

    @InjectRepository(DevicesEntity)
    private readonly devicesRepository: Repository<DevicesEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly usersService: UsersService,
    private readonly devicesService: DevicesService,
  ) {}

  async create(createRepairDto: CreateRepairDto) {
    const user = await this.usersService.findById(createRepairDto.userId);

    if (!user) {
      throw new NotFoundException(
        `User with ID: ${createRepairDto.userId} not found, unable to add repair.`,
      );
    }

    const device = await this.devicesService.findOne(createRepairDto.deviceId);

    if (!device) {
      throw new NotFoundException(
        `Device with ID: ${createRepairDto.deviceId} was not found, unable to add repair.`,
      );
    }

    const repair = await this.repairRepository.create({
      ...createRepairDto,
      user: user,
      device: device,
    });

    return await this.repairRepository.save(repair);
  }

  findAll() {
    return `This action returns all repairs`;
  }

  async findOne(id: string) {
    return this.repairRepository.findOne({
      where: { id },
      relations: ['user', 'device'], // ładujemy urządzenie jako relację
    });
  }

  async update(id: string, updateRepairDto: UpdateRepairDto) {
    const repair = await this.findOne(id);

    if (!repair) {
      throw new NotFoundException(`Repair with ID: ${id} was not found.`);
    }

    Object.assign(repair, updateRepairDto);
    return await this.repairRepository.save(repair);
  }

  remove(id: string) {
    return `This action removes a #${id} repair`;
  }
}
