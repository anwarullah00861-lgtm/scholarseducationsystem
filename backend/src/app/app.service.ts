import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly startedAt = Date.now();

  check(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  get uptimeSeconds(): number {
    return Math.round((Date.now() - this.startedAt) / 1000);
  }
}
