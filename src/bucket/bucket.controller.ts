
import { Controller, Get, Post, Body } from '@nestjs/common';
import { BucketService } from './bucket.service';

@Controller('bucket')
export class BucketController {
  constructor(private bucketService: BucketService) {}

  @Get()
  listBuckets() {
    return this.bucketService.getBuckets();
  }

  @Post()
  createBucket(@Body('name') name: string) {
    return this.bucketService.createBucket(name);
  }
}
