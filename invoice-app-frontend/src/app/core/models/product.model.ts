export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}
