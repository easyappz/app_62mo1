import instance from './axios';

export const register = async (payload) => {
  // payload: { email, first_name, last_name, password }
  const { data } = await instance.post('/auth/register', payload);
  return data;
};

export default {
  register,
};
