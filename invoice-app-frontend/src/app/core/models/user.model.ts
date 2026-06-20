export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
  password?: string;
}
