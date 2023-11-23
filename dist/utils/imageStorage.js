"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploader = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const httpException_1 = require("@exceptions/httpException");
class FileUploader {
    constructor(region, bucketName) {
        this.region = region;
        this.bucketName = bucketName;
        this.s3Client = new client_s3_1.S3({
            region: region,
            credentials: {
                accessKeyId: 'AKIAYH6AFTGXQONMGIOM',
                secretAccessKey: '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',
            },
            endpoint: 'https://s3.eu-north-1.amazonaws.com',
        });
    }
    async uploadFile(file, s3ObjectKey) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: s3ObjectKey,
                Body: file.data,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            await this.s3Client.send(command);
            return s3ObjectKey;
        }
        catch (err) {
            throw new httpException_1.HttpException(403, `'Error uploading image to S3:', ${err}`);
        }
    }
    async deleteFile(objectKey) {
        if (!objectKey)
            return;
        try {
            const params = {
                Bucket: this.bucketName,
                Key: objectKey,
            };
            const command = new client_s3_1.DeleteObjectCommand(params);
            await this.s3Client.send(command);
        }
        catch (error) {
            throw new httpException_1.HttpException(403, `'Error deleting image to S3:', ${error}`);
        }
    }
    static getUrl(fileName) {
        if (!fileName)
            return null;
        return `https://image-24.s3.eu-north-1.amazonaws.com/${fileName}`;
    }
}
exports.FileUploader = FileUploader;
//# sourceMappingURL=imageStorage.js.map