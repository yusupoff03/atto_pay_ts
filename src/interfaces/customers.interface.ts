export interface Customer {
  id?: string;
  name: string;
  phone: string;
  password?: string;
  hashed_password?: string;
}
