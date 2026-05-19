import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class D1Service {
  private readonly logger = new Logger(D1Service.name);

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !databaseId || !apiToken) {
      this.logger.error('Cloudflare D1 环境变量未配置');
      throw new Error('Database configuration missing');
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const result: any = await response.json();

    if (!result.success) {
      this.logger.error(`D1 query failed: ${JSON.stringify(result.errors)}`);
      throw new Error(result.errors?.[0]?.message || 'D1 query failed');
    }

    return result.result?.[0]?.results || [];
  }

  async execute(sql: string, params: any[] = []): Promise<{ meta: any }> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const result: any = await response.json();

    if (!result.success) {
      this.logger.error(`D1 execute failed: ${JSON.stringify(result.errors)}`);
      throw new Error(result.errors?.[0]?.message || 'D1 execute failed');
    }

    return result.result?.[0];
  }
}
