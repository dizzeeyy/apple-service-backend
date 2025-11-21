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

    const lastRepair = await this.repairRepository
      .createQueryBuilder('repair')
      .orderBy('repair.repairNumber', 'DESC')
      .getOne();

    let newNumber = 'R-000001';

    if (lastRepair && lastRepair.repairNumber) {
      const lastNumber = parseInt(lastRepair.repairNumber.split('-')[1], 10);
      const nextNumber = lastNumber + 1;
      newNumber = `R-${nextNumber.toString().padStart(6, '0')}`;
    }

    const repair = await this.repairRepository.create({
      ...createRepairDto,
      repairNumber: newNumber,
      user: user,
      device: device,
    });

    return await this.repairRepository.save(repair);
  }

  async findAll(page: number = 0, limit: number = 10) {
    const [repairs, total] = await this.repairRepository.findAndCount({
      skip: page * limit,
      take: limit,
      relations: ['device', 'user'],
    });

    return {
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      repairs,
    };
  }

  async findOne(id: string) {
    const repair = await this.repairRepository.findOne({
      where: { id },
      relations: ['user', 'device'], // ładujemy urządzenie jako relację
    });

    if (!repair) {
      throw new NotFoundException();
    }
    return repair;
  }

  async findOneByNumber(number: string) {
    const repair = await this.repairRepository.findOne({
      where: { repairNumber: number },
      relations: ['device', 'user'],
    });

    if (!repair) {
      throw new NotFoundException();
    }
    return repair;
  }

  async update(id: string, updateRepairDto: UpdateRepairDto) {
    const repair = await this.findOne(id);

    if (!repair) {
      throw new NotFoundException(`Repair with ID: ${id} was not found.`);
    }

    Object.assign(repair, updateRepairDto);
    return await this.repairRepository.save(repair);
  }

  async updateStatus(repairNumber: string, status: RepairStatus) {
    const repair = await this.findOneByNumber(repairNumber);

    const updated = await this.repairRepository.save({ ...repair, status });

    return updated;
  }

  async findBySerial(serialNumber: string) {
    return await this.repairRepository.findOne({
      where: { serialNumber },
      relations: ['users', 'repair'],
    });
  }

  async searchRepairs(repairNumber: string, serialNumber: string) {
    const repair = await this.repairRepository.findOne({
      where: { repairNumber, serialNumber },
      relations: ['device'],
    });

    if (!repair) {
      throw new NotFoundException();
    }
    return repair;
  }

  remove(id: string) {
    return `This action removes a #${id} repair`;
  }
}
