import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Dropdown, Avatar, Button, theme, Spin } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

dayjs.locale('ru');

const { Header, Content, Footer } = Layout;

const AppHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = useMemo(() => ([
    { key: '/', label: <Link data-easytag="id2-src/App.js" to="/">Главная</Link> },
    { key: '/profile', label: <Link data-easytag="id3-src/App.js" to="/profile">Профиль</Link> },
  ]), []);

  const selectedKeys = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/profile')) return ['/profile'];
    if (path === '/') return ['/'];
    return [''];
  }, [location.pathname]);

  const onMenuClick = ({ key }) => {
    if (key === 'profile') {
      navigate('/profile');
    }
    if (key === 'logout') {
      logout();
      navigate('/');
    }
  };

  const menuItems = [
    { key: 'profile', label: 'Профиль' },
    { type: 'divider' },
    { key: 'logout', label: 'Выйти' },
  ];

  return (
    <Header data-easytag="id6-src/App.js" style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      <div data-easytag="id7-src/App.js" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Menu
          data-easytag="id8-src/App.js"
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={items}
          style={{ flex: 1 }}
        />
        <div data-easytag="id9-src/App.js" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isAuthenticated ? (
            <div data-easytag="id10-src/App.js" style={{ display: 'flex', gap: 8 }}>
              <Link to="/login"><Button data-easytag="id11-src/App.js" type="primary">Вход</Button></Link>
              <Link to="/register"><Button data-easytag="id12-src/App.js">Регистрация</Button></Link>
            </div>
          ) : (
            <Dropdown menu={{ items: menuItems, onClick: onMenuClick }} placement="bottomRight" trigger={['click']}>
              <div data-easytag="id13-src/App.js" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar size="small">{(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</Avatar>
                <span data-easytag="id14-src/App.js">{user?.first_name ? `${user.first_name} ${user?.last_name || ''}`.trim() : (user?.email || 'Профиль')}</span>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </Header>
  );
};

const RouteSync = () => {
  useEffect(() => {
    const routes = ['/', '/register', '/login', '/profile', '*'];
    if (typeof window.handleRoutes === 'function') {
      try { window.handleRoutes(routes); } catch {}
    }
  }, []);
  return null;
};

function AppShell() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div data-easytag="id32-src/App.js" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout data-easytag="id33-src/App.js" style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content data-easytag="id34-src/App.js" style={{ padding: '24px 16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <RouteSync />
      </Content>
      <Footer data-easytag="id35-src/App.js" style={{ textAlign: 'center' }}>
        Easyapp © {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider locale={ruRU} theme={{ algorithm: theme.defaultAlgorithm }}>
        <AuthProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
