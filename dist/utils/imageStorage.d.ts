export declare class FileUploader {
    private region;
    private bucketName;
    private s3Client;
    constructor(region: string, bucketName: string);
    uploadFile(file: any, s3ObjectKey: string): Promise<string>;
    deleteFile(objectKey: string): Promise<void>;
    static getUrl(fileName: string): string;
}
