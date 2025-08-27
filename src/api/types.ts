export enum StatusEnum {
  ATIVO = 'ativo',
  INATIVO = 'inativo'
}

export interface IUser {
  id: number;
  nome: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
  status: StatusEnum;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}

export interface IUsersResponse {
  status: string;
  data: {
    users: IUser[];
    count: number;
  };
}

export interface IGenericResponse {
  status: string;
  message: string;
}