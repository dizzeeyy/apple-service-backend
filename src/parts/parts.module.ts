import { Module } from '@nestjs/common';
import { PartsService } from './parts.service';
import { PartsController } from './parts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartEntity } from './entities/parts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartEntity])],
  controllers: [PartsController],
  providers: [PartsService],
})
export class PartsModule {}
