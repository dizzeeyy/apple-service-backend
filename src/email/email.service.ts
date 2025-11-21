// email.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RepairsFormDto } from 'src/repairs/dto/form-repair.dto';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emailQueue') private emailQueue: Queue) {}

  async queueEmail(repairsFormDTO: RepairsFormDto) {
    const job = await this.emailQueue.add('sendEmail', repairsFormDTO);

    return job;
  }

  async getJobStatus(jobId: string) {
    const job = await this.emailQueue.getJob(jobId);
    if (!job) return null;
    return {
      id: job.id,
      state: await job.getState(), // np. 'completed', 'failed', 'waiting'
      progress: job.progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
