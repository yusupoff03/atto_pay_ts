import { ServiceInterface, ServiceUpdate } from '@interfaces/service.interface';
export declare class ServiceService {
    private fileUploader;
    constructor();
    createService(serviceData: ServiceInterface, lang: any, image?: any): Promise<ServiceInterface>;
    getMerchantServices(merchantId: string, lang: any): Promise<ServiceInterface[]>;
    getAllServices(lang: any, customerId: any): Promise<ServiceInterface[]>;
    getOneById(merchantId: any, serviceId: any, lang: any): Promise<any>;
    deleteOneById(merchantId: any, serviceId: any, lang: any): Promise<any>;
    updateService(merchantId: any, service: ServiceUpdate, lang: any, image?: any): Promise<any>;
    getOneByQr(key: any): Promise<any>;
    getOnePublicById(id: any, lang: any): Promise<any>;
}
