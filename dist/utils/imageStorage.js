"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploader", {
    enumerable: true,
    get: function() {
        return FileUploader;
    }
});
const _clients3 = require("@aws-sdk/client-s3");
const _httpException = require("../exceptions/httpException");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let FileUploader = class FileUploader {
    async uploadFile(file, s3ObjectKey) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: s3ObjectKey,
                Body: file.data
            };
            const command = new _clients3.PutObjectCommand(params);
            await this.s3Client.send(command);
            return s3ObjectKey;
        } catch (err) {
            throw new _httpException.HttpException(403, `'Error uploading image to S3:', ${err}`);
        }
    }
    async deleteFile(objectKey) {
        if (!objectKey) return;
        try {
            const params = {
                Bucket: this.bucketName,
                Key: objectKey
            };
            const command = new _clients3.DeleteObjectCommand(params);
            await this.s3Client.send(command);
        } catch (error) {
            throw new _httpException.HttpException(403, `'Error deleting image to S3:', ${error}`);
        }
    }
    static getUrl(fileName) {
        if (!fileName) return null;
        return `https://image-24.s3.eu-north-1.amazonaws.com/${fileName}`;
    }
    constructor(region, bucketName){
        _define_property(this, "region", void 0);
        _define_property(this, "bucketName", void 0);
        _define_property(this, "s3Client", void 0);
        this.region = region;
        this.bucketName = bucketName;
        this.s3Client = new _clients3.S3({
            region: region,
            credentials: {
                accessKeyId: 'AKIAYH6AFTGXQONMGIOM',
                secretAccessKey: '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'
            },
            endpoint: 'https://s3.eu-north-1.amazonaws.com'
        });
    }
};

//# sourceMappingURL=imageStorage.js.map