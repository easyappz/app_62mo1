import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import * as authApi from '../api/auth';
import * as profileApi from '../api/profile';

const AuthContext = createContext({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async (_email, _password) => {},
  logout: () => {},
  loadUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('authUser');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);

  const persist = useCallback((next) => {
    if (!next) return;
    if (typeof next.accessToken === 'string') localStorage.setItem('accessToken', next.accessToken);
    if (typeof next.refreshToken === 'string') localStorage.setItem('refreshToken', next.refreshToken);
    if (next.user) localStorage.setItem('authUser', JSON.stringify(next.user));
  }, []);

  const clearPersist = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
  }, []);

  const loadUser = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) return null;
    try {
      const { data } = await profileApi.getMe();
      setUser(data);
      localStorage.setItem('authUser', JSON.stringify(data));
      return data;
    } catch (e) {
      // if fetching profile fails, keep unauthenticated state
      return null;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const hide = message.loading('Вход...');
    try {
      const { data } = await authApi.login(email, password);
      const newAccess = data.access || data.access_token || data.token || data.jwt;
      const newRefresh = data.refresh || data.refresh_token || null;
      if (!newAccess) throw new Error('Токен не получен');
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
      persist({ accessToken: newAccess, refreshToken: newRefresh });
      const profile = await loadUser();
      persist({ user: profile });
      message.success('Успешный вход');
      return { access: newAccess, refresh: newRefresh, user: profile };
    } catch (e) {
      message.error('Ошибка входа');
      throw e;
    } finally {
      hide();
    }
  }, [loadUser, persist]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    clearPersist();
    message.info('Вы вышли из аккаунта');
  }, [clearPersist]);

  // Sync with global logout events (from axios on refresh failure)
  useEffect(() => {
    const onLogout = () => logout();
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [logout]);

  // Initial load of user if token exists
  useEffect(() => {
    const init = async () => {
      try {
        if (localStorage.getItem('accessToken')) {
          await loadUser();
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [loadUser]);

  const value = useMemo(() => ({
    accessToken,
    refreshToken,
    user,
    isLoading,
    isAuthenticated: Boolean(accessToken && user),
    login,
    logout,
    loadUser,
  }), [accessToken, refreshToken, user, isLoading, login, logout, loadUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
