import axios from 'axios';
import type { IGenericResponse, IUserResponse, IUsersResponse } from './types';
import type { EditUserInput } from '../crud/edit.user.page';
import type { RegisterInput } from '../crud/create.user.page';

const BASE_URL = 'http://localhost:10000/';

export const userApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

userApi.defaults.headers.common['Content-Type'] = 'application/json';

export const getUsersFn = async () => {
  const response = await userApi.get<IUsersResponse>('users');
  return response.data;
};

export const getUserByIdFn = async (id: string | undefined) => {
  const response = await userApi.get<IUserResponse>(`users/${id}`);
  return response.data;
};

export const updateUserFn = async (user: EditUserInput) => {
  const response = await userApi.patch<IGenericResponse>(`users/${user.id}/update`, user);
  return response.data;
};

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await userApi.post<IGenericResponse>('users/new', user);
  return response.data;
};

export const deleteUserFn = async (id: string | undefined) => {
  const response = await userApi.delete<IGenericResponse>(`users/${id}`);
  return response.data;
};
