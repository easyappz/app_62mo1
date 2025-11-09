import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Dropdown, Avatar, Button, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

dayjs.locale('ru');

const { Header, Content, Footer } = Layout;

const AppHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

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

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', label: <Link data-easytag="id4-src/App.js" to="/profile">Мой профиль</Link> },
        { type: 'divider' },
        { key: 'logout', label: <span data-easytag="id5-src/App.js" onClick={logout}>Выйти</span> },
      ]}
    />
  );

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
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
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

const HomePage = () => (
  <div data-easytag="id15-src/App.js" style={{ padding: 24 }}>
    <h1 data-easytag="id16-src/App.js" style={{ marginBottom: 12 }}>Главная</h1>
    <p data-easytag="id17-src/App.js">Добро пожаловать! Продолжайте работу с приложением.</p>
  </div>
);

const LoginPage = () => {
  const { login } = useAuth();
  const [form] = require('antd').Form.useForm();
  const { Input, Form, Button } = require('antd');

  const onFinish = async (values) => {
    await login(values.email, values.password);
  };

  return (
    <div data-easytag="id18-src/App.js" style={{ maxWidth: 420, margin: '32px auto' }}>
      <h2 data-easytag="id19-src/App.js" style={{ marginBottom: 24 }}>Вход</h2>
      <Form data-easytag="id20-src/App.js" layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="email" label="Почта" rules={[{ required: true, message: 'Введите почту' }, { type: 'email', message: 'Некорректная почта' }]}>
          <Input data-easytag="id21-src/App.js" placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }]}>
          <Input.Password data-easytag="id22-src/App.js" placeholder="Пароль" />
        </Form.Item>
        <Form.Item>
          <Button data-easytag="id23-src/App.js" type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const RegisterPage = () => (
  <div data-easytag="id24-src/App.js" style={{ maxWidth: 640, margin: '32px auto' }}>
    <h2 data-easytag="id25-src/App.js" style={{ marginBottom: 12 }}>Регистрация</h2>
    <p data-easytag="id26-src/App.js">Страница регистрации будет реализована на следующем шаге.</p>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <div data-easytag="id27-src/App.js" style={{ padding: 24 }}>
      <h2 data-easytag="id28-src/App.js" style={{ marginBottom: 12 }}>Профиль</h2>
      <div data-easytag="id29-src/App.js">Почта: <b>{user?.email || '-'}</b></div>
      <div data-easytag="id30-src/App.js">Имя: <b>{user?.first_name || '-'}</b></div>
      <div data-easytag="id31-src/App.js">Фамилия: <b>{user?.last_name || '-'}</b></div>
    </div>
  );
};

const RouteSync = () => {
  // Notify host about routes
  useEffect(() => {
    const routes = ['/', '/register', '/login', '/profile'];
    if (typeof window.handleRoutes === 'function') {
      try { window.handleRoutes(routes); } catch {}
    }
  }, []);
  return null;
};

function AppShell() {
  return (
    <Layout data-easytag="id32-src/App.js" style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content data-easytag="id33-src/App.js" style={{ padding: '24px 16px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <RouteSync />
      </Content>
      <Footer data-easytag="id34-src/App.js" style={{ textAlign: 'center' }}>
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
