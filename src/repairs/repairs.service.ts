import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairEntity, RepairStatus } from './entities/repair.entity';
import { In, Repository } from 'typeorm';
import { DevicesEntity } from 'src/devices/entities/device.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { DevicesService } from 'src/devices/devices.service';
import { RepairsFormDto } from './dto/form-repair.dto';
import { EmailService } from 'src/email/email.service';
import { PartEntity } from 'src/parts/entities/parts.entity';
import { CreateRequestPayload, RepearService } from 'src/repear/repear.service';

@Injectable()
export class RepairsService {
  constructor(
    @InjectRepository(RepairEntity)
    private readonly repairRepository: Repository<RepairEntity>,

    @InjectRepository(DevicesEntity)
    private readonly devicesRepository: Repository<DevicesEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(PartEntity)
    private readonly partRepository: Repository<PartEntity>,

    private readonly usersService: UsersService,
    private readonly devicesService: DevicesService,
    private readonly emailService: EmailService,
    private readonly repearService: RepearService,
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

    let partsArray: PartEntity[] = [];
    if (createRepairDto.parts && createRepairDto.parts.length > 0) {
      partsArray = await this.partRepository.find({
        where: { id: In(createRepairDto.parts) },
      });

      if (partsArray.length !== createRepairDto.parts.length) {
        throw new NotFoundException('Some parts were not found');
      }
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

    const { parts, ...repairData } = createRepairDto;

    const repair = this.repairRepository.create({
      ...repairData,
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
      relations: ['device', 'user', 'parts'],
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
      relations: ['user', 'device', 'parts'], // ładujemy urządzenie jako relację
    });

    if (!repair) {
      throw new NotFoundException();
    }
    return repair;
  }

  async findOneByNumber(number: string) {
    const repair = await this.repairRepository.findOne({
      where: { repairNumber: number },
      relations: ['device', 'user', 'parts'],
    });

    if (!repair) {
      throw new NotFoundException();
    }
    return repair;
  }

  async update(
    id: string,
    updateRepairDto: UpdateRepairDto,
  ): Promise<RepairEntity> {
    const repair = await this.findOne(id);

    if (!repair) {
      throw new NotFoundException(`Repair with ID: ${id} was not found.`);
    }

    // ZMIEŃ findByIds na find z In operator
    if (updateRepairDto.parts) {
      const parts = await this.partRepository.find({
        where: { id: In(updateRepairDto.parts) },
      });

      if (parts.length !== updateRepairDto.parts.length) {
        throw new NotFoundException('Some parts were not found');
      }

      repair.parts = parts;
      delete updateRepairDto.parts;
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
      relations: ['users', 'repair', 'parts'],
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

  async createMailForm(repairsFormDTO: RepairsFormDto): Promise<any> {
    const payload: CreateRequestPayload = {
      title: `Naprawa: ${repairsFormDTO.serialNumber} | ${repairsFormDTO.email}`,
      description: `Naprawa: ${repairsFormDTO.serialNumber}
      Opis: ${repairsFormDTO.description}
      Kontakt: P. ${repairsFormDTO.name} @: ${repairsFormDTO.email} tel: ${repairsFormDTO.phone}`,
      priority: 'NONE',
      primaryUser: {
        id: 82,
      },
    };

    const createdRequest = await this.repearService.createRequest(payload);
    const job = await this.emailService.queueEmail(repairsFormDTO);

    return { status: 'OK', jobId: job.id, request: createdRequest };
  }

  async getEmailJobStatus(jobId: string): Promise<any> {
    const status = await this.emailService.getJobStatus(jobId);

    if (!status) {
      throw new NotFoundException();
    }
    return status;
  }
}
