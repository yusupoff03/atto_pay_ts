export interface Customer {
  id?: string;
  name: string;
  trust?: boolean;
  phone: string;
  photo_url?: string;
  password?: string;
  hashed_password?: string;
}
export interface UpdateCustomerData {
  name: string;
  password: string;
  deleteImage?: boolean | false;
}

export interface CustomerLogin {
  phone: string;
  password?: string;
  otp?: string;
  trust: boolean;
}
