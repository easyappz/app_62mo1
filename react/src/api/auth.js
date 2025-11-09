import instance from './axios';

export const login = (email, password) => {
  return instance.post('/auth/login', { email, password });
};
