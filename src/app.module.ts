// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BucketModule } from './bucket/bucket.module';
import { S3ObjectModule } from './s3-object/s3-object.module';

@Module({
  imports: [BucketModule, S3ObjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
