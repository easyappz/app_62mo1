import instance from './axios';

export const getMe = async () => {
  const res = await instance.get('/profile/me');
  // GET returns pure profile serializer data
  return res.data;
};

export const updateMe = async (payload) => {
  const res = await instance.patch('/profile/me', payload);
  // PATCH returns { message, profile } as per backend
  return res.data?.profile || res.data;
};
