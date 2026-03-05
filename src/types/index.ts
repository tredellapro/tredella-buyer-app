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
  name: string;
  token?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
