export interface Client {
  id: number;
  name: string;
  documentType: 'RUC' | 'CI' | 'Pasaporte';
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateClientRequest {
  name: string;
  documentType: 'RUC' | 'CI' | 'Pasaporte';
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateClientRequest {
  name: string;
  documentType: 'RUC' | 'CI' | 'Pasaporte';
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
}
