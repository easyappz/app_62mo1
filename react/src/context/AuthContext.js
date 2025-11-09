import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { login as apiLogin, refresh as apiRefresh } from '../api/auth';
import { getMe as apiGetMe } from '../api/profile';

const AuthContext = createContext({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  login: async (_email, _password) => {},
  logout: () => {},
  setUser: (_user) => {},
});

const STORAGE_KEYS = {
  access: 'accessToken',
  refresh: 'refreshToken',
  user: 'authUser',
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const isAuthenticated = !!user;

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.access);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  const logout = useCallback(() => {
    clearStorage();
    setUser(null);
  }, []);

  const fetchAndSetUser = useCallback(async () => {
    const me = await apiGetMe();
    setUser(me);
    try {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(me));
    } catch { /* ignore */ }
    return me;
  }, []);

  const login = useCallback(async (email, password) => {
    const tokens = await apiLogin({ email, password });
    if (tokens?.access) localStorage.setItem(STORAGE_KEYS.access, tokens.access);
    if (tokens?.refresh) localStorage.setItem(STORAGE_KEYS.refresh, tokens.refresh);
    await fetchAndSetUser();
  }, [fetchAndSetUser]);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.user);
      const access = localStorage.getItem(STORAGE_KEYS.access);
      const refresh = localStorage.getItem(STORAGE_KEYS.refresh);

      if (!access && !refresh) {
        logout();
        return;
      }

      // Prefer refresh to ensure valid access
      if (refresh) {
        try {
          const data = await apiRefresh({ refresh });
          if (data?.access) localStorage.setItem(STORAGE_KEYS.access, data.access);
        } catch (_e) {
          // refresh failed; clear and exit
          logout();
          return;
        }
      }

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed || null);
        } catch {
          // ignore parse error
        }
      }

      // Validate user by pulling fresh data
      await fetchAndSetUser();
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndSetUser, logout]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const onExternalLogout = () => {
      // Called when axios interceptor fails to refresh
      if (isAuthenticated) {
        message.info('Сессия истекла, войдите снова');
      }
      logout();
    };
    window.addEventListener('auth:logout', onExternalLogout);
    return () => window.removeEventListener('auth:logout', onExternalLogout);
  }, [logout, isAuthenticated]);

  const value = useMemo(() => ({
    isLoading,
    isAuthenticated,
    user,
    login,
    logout,
    setUser,
  }), [isLoading, isAuthenticated, user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
