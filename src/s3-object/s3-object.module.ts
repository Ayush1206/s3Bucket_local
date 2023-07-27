
import { Module } from '@nestjs/common';
import { S3ObjectService } from './s3-object.service';
import { S3ObjectController } from './s3-object.controller';
import { BucketModule } from '../bucket/bucket.module';

@Module({
  imports: [BucketModule], 
  controllers: [S3ObjectController],
  providers: [S3ObjectService],
})
export class S3ObjectModule {}
