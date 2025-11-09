import React from 'react';
import { Button, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph } = Typography;

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div data-easytag="id1-src/pages/Home.jsx" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Card data-easytag="id2-src/pages/Home.jsx" style={{ maxWidth: 760, width: '100%' }}>
        <Title data-easytag="id3-src/pages/Home.jsx" level={2} style={{ marginBottom: 12 }}>
          Добро пожаловать в приложение
        </Title>
        <Paragraph data-easytag="id4-src/pages/Home.jsx" style={{ marginBottom: 24 }}>
          Это стартовая страница. Пожалуйста, войдите или зарегистрируйте новый аккаунт, чтобы продолжить работу.
        </Paragraph>
        {!isAuthenticated ? (
          <div data-easytag="id5-src/pages/Home.jsx" style={{ display: 'flex', gap: 12 }}>
            <Link data-easytag="id6-src/pages/Home.jsx" to="/login">
              <Button data-easytag="id7-src/pages/Home.jsx" type="primary">Войти</Button>
            </Link>
            <Link data-easytag="id8-src/pages/Home.jsx" to="/register">
              <Button data-easytag="id9-src/pages/Home.jsx">Регистрация</Button>
            </Link>
          </div>
        ) : (
          <div data-easytag="id10-src/pages/Home.jsx">
            <Link data-easytag="id11-src/pages/Home.jsx" to="/profile">
              <Button data-easytag="id12-src/pages/Home.jsx" type="primary">Перейти в профиль</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
