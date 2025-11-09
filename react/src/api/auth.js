import instance from './axios';

export const login = async ({ email, password }) => {
  const res = await instance.post('/auth/login', { email, password });
  return res.data; // expects { access, refresh }
};

export const refresh = async ({ refresh }) => {
  const res = await instance.post('/auth/refresh', { refresh });
  return res.data; // expects { access, refresh? }
};

export const register = async ({ email, first_name, last_name, password }) => {
  const res = await instance.post('/auth/register', { email, first_name, last_name, password });
  return res.data;
};
