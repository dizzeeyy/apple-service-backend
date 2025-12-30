import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

type signInResponse = { accessToken: string };
export type CreateRequestPayload = {
  title: string;
  description: string;
  priority: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  estimatedStartDate?: string;
  estimatedDuration?: string;
  primaryUser: { id: number };
  location?: any;
  team?: any;
  asset?: any;
  assignedTo?: any[];
  category?: any;
  image?: any;
  files?: any[];
};
@Injectable()
export class RepearService {
  private accessToken: string | null = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  private async signIn(): Promise<string> {
    const body = {
      email: this.config.get<string>('REPEAR_API_EMAIL'),
      type: this.config.get<string>('REPEAR_API_TYPE'),
      password: this.config.get<string>('REPEAR_API_PASSWORD'),
    };

    const { data } = await lastValueFrom(
      this.http.post<signInResponse>('/auth/signin', body),
    );
    if (!data?.accessToken)
      throw new UnauthorizedException('Brak accessToken z /auth/signin');

    this.accessToken = data.accessToken;

    return data.accessToken;
  }

  async createRequest(payload: CreateRequestPayload): Promise<any> {
    const token = await this.signIn();

    const { data } = await lastValueFrom(
      this.http.post('/requests', payload, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    return data;
  }
}
