import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '@exceptions/httpException';

export class FileUploader {
  private s3Client: S3;

  constructor(private region: string, private bucketName: string) {
    this.s3Client = new S3({
      region: region,
      credentials: {
        accessKeyId: 'AKIAYH6AFTGXQONMGIOM',
        secretAccessKey: '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',
      },
      endpoint: 'https://s3.eu-north-1.amazonaws.com',
    });
  }

  async uploadFile(file: any, s3ObjectKey: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: s3ObjectKey,
        Body: file.data,
      };
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);
      return s3ObjectKey;
    } catch (err) {
      throw new HttpException(403, `'Error uploading image to S3:', ${err}`);
    }
  }
  async deleteFile(objectKey: string): Promise<void> {
    if (!objectKey) return;
    try {
      const params = {
        Bucket: this.bucketName,
        Key: objectKey,
      };
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);
    } catch (error) {
      throw new HttpException(403, `'Error deleting image to S3:', ${error}`);
    }
  }
  public static getUrl(fileName: string): string {
    if (!fileName) return null;
    return `https://image-24.s3.eu-north-1.amazonaws.com/${fileName}`;
  }
}
