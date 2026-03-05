export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  permissions: string[];
  emailVerified: boolean;
  avatar: string | null;
  tenantId: string;
}

export interface CartItem extends Product {
  quantity: number;
}
