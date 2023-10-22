export interface ServiceInterface {
  id?: string;
  name: string;
  price: number;
  merchant_id?: string;
  categoryId: string;
  image_url?: string;
  isActive: boolean;
  saved?: boolean;
}
export interface ServiceUpdate {
  id: any;
  name?: string;
  price?: number;
  categoryId?: any;
  isActive?: boolean;
  deleteImage?: boolean;
}
