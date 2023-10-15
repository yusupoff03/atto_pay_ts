export interface ServiceInterface {
  id?: string;
  name: string;
  price: number;
  merchant_id?: string;
  category_id: string;
  logo_url?: string;
  isActive: boolean;
}
