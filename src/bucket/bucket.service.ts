import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';

@Injectable()
export class BucketService {
  private readonly basePath = './buckets';

  constructor() {
    fs.ensureDirSync(this.basePath);
  }

  createBucket(name: string): void {

    if (!name) {
        throw new BadRequestException('Bucket name is required');
      }

    const bucketPath = `${this.basePath}/${name}`;
    if (fs.existsSync(bucketPath)) {
      throw new ConflictException(`Bucket ${name} already exists`);
    }
    fs.ensureDirSync(`${this.basePath}/${name}`);
  }

  getBuckets(): string[] {
    return fs.readdirSync(this.basePath);
  }
}
