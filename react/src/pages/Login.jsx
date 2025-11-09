import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/profile');
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Ошибка входа. Проверьте почту и пароль.';
      message.error(String(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-src/pages/Login.jsx" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Card data-easytag="id2-src/pages/Login.jsx" style={{ width: 420 }}>
        <Title data-easytag="id3-src/pages/Login.jsx" level={3} style={{ marginBottom: 8 }}>Вход</Title>
        <Text data-easytag="id4-src/pages/Login.jsx" type="secondary">Введите свои данные для авторизации</Text>
        <Form
          data-easytag="id5-src/pages/Login.jsx"
          layout="vertical"
          form={form}
          style={{ marginTop: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            data-easytag="id6-src/pages/Login.jsx"
            name="email"
            label="Почта"
            rules={[
              { required: true, message: 'Введите почту' },
              { type: 'email', message: 'Некорректная почта' },
            ]}
          >
            <Input data-easytag="id7-src/pages/Login.jsx" placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            data-easytag="id8-src/pages/Login.jsx"
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password data-easytag="id9-src/pages/Login.jsx" placeholder="Ваш пароль" autoComplete="current-password" />
          </Form.Item>

          <Form.Item data-easytag="id10-src/pages/Login.jsx">
            <Button data-easytag="id11-src/pages/Login.jsx" type="primary" htmlType="submit" block loading={loading}>
              Войти
            </Button>
          </Form.Item>

          <div data-easytag="id12-src/pages/Login.jsx" style={{ textAlign: 'center' }}>
            <Text data-easytag="id13-src/pages/Login.jsx">Нет аккаунта? </Text>
            <Link data-easytag="id14-src/pages/Login.jsx" to="/register">Зарегистрироваться</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
