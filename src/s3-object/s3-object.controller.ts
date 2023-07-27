
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { S3ObjectService } from './s3-object.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('object')
export class S3ObjectController {
  constructor(private s3ObjectService: S3ObjectService) {}

  @Get(':bucketName')
  getObjects(@Param('bucketName') bucketName: string) {
    return this.s3ObjectService.getObjects(bucketName);
  }

  @Get(':bucketName/:key')
  getObjectStream(
    @Param('bucketName') bucketName: string,
    @Param('key') key: string,
    @Res() res: Response,
  ) {
    const readStream = this.s3ObjectService.downloadObject(bucketName, key);
    res.setHeader('Content-Disposition', 'attachment; filename=' + key);
    readStream.pipe(res);
  }

//   @Get(':bucketName/:objectKey')
//   getObject(
//     @Param('bucketName') bucketName: string,
//     @Param('objectKey') objectKey: string,
//   ) {
//     return this.s3ObjectService.getObject(bucketName, objectKey);
//   }

  @Post(':bucketName/:key')
  @UseInterceptors(FileInterceptor('file'))
  putObject(
    @Param('bucketName') bucketName: string,
    @Param('key') key: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): void {
    const result = this.s3ObjectService.putObject(bucketName, key, file);
    res.status(201).json(result);
  }

  @Delete(':bucketName/:objectKey')
  deleteObject(
    @Param('bucketName') bucketName: string,
    @Param('objectKey') objectKey: string,
  ) {
    return this.s3ObjectService.deleteObject(bucketName, objectKey);
  }
}
