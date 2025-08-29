export enum StatusEnum {
  ATIVO = 'ativo',
  INATIVO = 'inativo'
}

export enum RoleType {
  USER = 'user',
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SYSTEM = 'system',
}

export interface IUser {
  id?: number | undefined;
  nome: string;
  email: string;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  password: string;
  passwordConfirm: string;
  active?: boolean | undefined;
  status?: string | undefined;
  role?: RoleType | undefined;
  isDeleted?: boolean | undefined;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface IUserResponse {
  status: string;
  data: IUser;
}

export interface IUsersResponse {
  status: string;
  data: IUser[];
  count: number;
}

export interface IGenericResponse {
  status: string;
  message: string;
}