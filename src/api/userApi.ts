import axios from 'axios';
import type { IGenericResponse, IUserResponse, IUsersResponse } from './types';

const BASE_URL = 'http://localhost:3000/';

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

/*
export const updateUserFn = async (user: EditUserInput) => {
  const response = await userApi.post<IGenericResponse>(`auth/user/${user.id}`, user);
  return response.data;
};

export const signUpUserFn = async (user: RegisterInput) => {
  const response = await userApi.post<IGenericResponse>('auth/register', user);
  return response.data;
};
*/