export interface Product {
  id: string;
  title: string;
  brand: string;
  description?: string;
  imageUrl: string;
  category: string;
  retailPrice: number;
  wholesalePrice?: number;
  wholesaleMoq?: number;
  wholesale?: {
    moq: number;
    tiers: { min: number; max: number | string; price: number }[];
  };
  rating?: number;
  reviewCount?: number;
  stockStatus?: "in_stock" | "out_of_stock" | "low_stock";
  discountBadge?: string;
  colors?: string[];
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
