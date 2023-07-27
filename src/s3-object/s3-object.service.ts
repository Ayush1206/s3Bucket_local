import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { MulterFile } from './s3-interface';
import { Stream } from 'stream';

@Injectable()
export class S3ObjectService {
  private readonly basePath = './buckets';

  putObject(bucketName: string, key: string, file: MulterFile): { message: string, objectKey: string } {
   
    const bucketPath = path.join(this.basePath, bucketName);
    let filePath = path.join(bucketPath, key);
   
    if (!bucketName) {
      throw new BadRequestException('Bucket name is required');
    }
    if (!key) {
      throw new BadRequestException('Object key is required');
    }
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required');
    }

    if (!fs.existsSync(bucketPath)) {
      throw new NotFoundException(`Bucket ${bucketName} does not exist`);
    }

    if (fs.existsSync(filePath)) {
        const timestamp = new Date().getTime();
        const fileExtension = path.extname(key);
        const fileNameWithoutExtension = path.basename(key, fileExtension);
  
       
        key = `${fileNameWithoutExtension}-${timestamp}${fileExtension}`;
        filePath = path.join(bucketPath, key);
      }
  

    filePath = path.join(bucketPath, key);
    fs.writeFileSync(filePath, file.buffer);

    return { message: `File ${key} uploaded successfully in bucket ${bucketName}`, objectKey: key };
  }

  getObject(bucketName: string, key: string): string {
    if (!bucketName) {
      throw new BadRequestException('Bucket name is required');
    }
    if (!key) {
      throw new BadRequestException('Object key is required');
    }

    const bucketPath = path.join(this.basePath, bucketName);
    if (!fs.existsSync(bucketPath)) {
      throw new NotFoundException(`Bucket ${bucketName} does not exist`);
    }

    const objectPath = path.join(bucketPath, key);
    if (!fs.existsSync(objectPath)) {
      throw new NotFoundException(`Object ${key} does not exist in bucket ${bucketName}`);
    }

    return fs.readFileSync(objectPath, 'utf-8');
  }

  downloadObject(bucketName: string, key: string): Stream {
    const bucketPath = path.join(this.basePath, bucketName);
    if (!fs.existsSync(bucketPath)) {
      throw new NotFoundException(`Bucket ${bucketName} not found`);
    }

    const filePath = path.join(bucketPath, key);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Object ${key} does not exist in bucket ${bucketName}`);
    }

    return fs.createReadStream(filePath);
  }


  getObjects(bucketName: string): string[] {
    if (!bucketName) {
      throw new BadRequestException('Bucket name is required');
    }

    const bucketPath = path.join(this.basePath, bucketName);
    if (!fs.existsSync(bucketPath)) {
      throw new NotFoundException(`Bucket ${bucketName} does not exist`);
    }

    return fs.readdirSync(bucketPath);
  }

  deleteObject(bucketName: string, key: string): void {
    if (!bucketName) {
      throw new BadRequestException('Bucket name is required');
    }
    if (!key) {
      throw new BadRequestException('Object key is required');
    }

    const bucketPath = path.join(this.basePath, bucketName);
    if (!fs.existsSync(bucketPath)) {
      throw new NotFoundException(`Bucket ${bucketName} does not exist`);
    }

    const objectPath = path.join(bucketPath, key);
    if (!fs.existsSync(objectPath)) {
      throw new NotFoundException(`Object ${key} does not exist in bucket ${bucketName}`);
    }

    fs.unlinkSync(objectPath);
  }
}
