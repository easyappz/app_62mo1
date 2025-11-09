import instance from './axios';

export const getMe = () => instance.get('/profile/me');
