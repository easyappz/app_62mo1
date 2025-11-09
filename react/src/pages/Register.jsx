import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../api/auth';

const { Title, Text } = Typography;

const normalizeTrim = (value) => (typeof value === 'string' ? value.trim() : value);

const setFormServerErrors = (form, data) => {
  if (!data || typeof data !== 'object') return;
  const fieldErrors = [];
  Object.keys(data).forEach((key) => {
    const val = data[key];
    if (Array.isArray(val)) {
      fieldErrors.push({ name: key, errors: val.map(String) });
    } else if (typeof val === 'string') {
      fieldErrors.push({ name: key, errors: [val] });
    }
  });
  if (fieldErrors.length) form.setFields(fieldErrors);
};

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const payload = {
      email: values.email,
      first_name: normalizeTrim(values.first_name),
      last_name: normalizeTrim(values.last_name),
      password: values.password,
    };
    setLoading(true);
    try {
      await registerRequest(payload);
      message.success('Регистрация прошла успешно');
      navigate('/login');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.detail) {
        message.error(String(data.detail));
      }
      setFormServerErrors(form, data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-src/pages/Register.jsx" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Card data-easytag="id2-src/pages/Register.jsx" style={{ width: 520 }}>
        <Title data-easytag="id3-src/pages/Register.jsx" level={3} style={{ marginBottom: 8 }}>Регистрация</Title>
        <Text data-easytag="id4-src/pages/Register.jsx" type="secondary">Создайте аккаунт, чтобы продолжить</Text>
        <Form
          data-easytag="id5-src/pages/Register.jsx"
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            data-easytag="id6-src/pages/Register.jsx"
            name="email"
            label="Почта"
            rules={[
              { required: true, message: 'Введите почту' },
              { type: 'email', message: 'Некорректная почта' },
            ]}
          >
            <Input data-easytag="id7-src/pages/Register.jsx" placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            data-easytag="id8-src/pages/Register.jsx"
            name="first_name"
            label="Имя"
            rules={[
              { required: true, message: 'Введите имя' },
              { whitespace: true, message: 'Имя не должно быть пустым' },
              {
                validator: (_, value) => {
                  if (typeof value === 'string' && value.trim().length >= 1) return Promise.resolve();
                  return Promise.reject(new Error('Имя не должно быть пустым'));
                },
              },
            ]}
          >
            <Input data-easytag="id9-src/pages/Register.jsx" placeholder="Иван" autoComplete="given-name" />
          </Form.Item>

          <Form.Item
            data-easytag="id10-src/pages/Register.jsx"
            name="last_name"
            label="Фамилия"
            rules={[
              { required: true, message: 'Введите фамилию' },
              { whitespace: true, message: 'Фамилия не должна быть пустой' },
              {
                validator: (_, value) => {
                  if (typeof value === 'string' && value.trim().length >= 1) return Promise.resolve();
                  return Promise.reject(new Error('Фамилия не должна быть пустой'));
                },
              },
            ]}
          >
            <Input data-easytag="id11-src/pages/Register.jsx" placeholder="Иванов" autoComplete="family-name" />
          </Form.Item>

          <Form.Item
            data-easytag="id12-src/pages/Register.jsx"
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен быть не менее 6 символов' },
            ]}
          >
            <Input.Password data-easytag="id13-src/pages/Register.jsx" placeholder="Не менее 6 символов" autoComplete="new-password" />
          </Form.Item>

          <Form.Item data-easytag="id14-src/pages/Register.jsx">
            <Button data-easytag="id15-src/pages/Register.jsx" type="primary" htmlType="submit" block loading={loading}>
              Зарегистрироваться
            </Button>
          </Form.Item>

          <div data-easytag="id16-src/pages/Register.jsx" style={{ textAlign: 'center' }}>
            <Text data-easytag="id17-src/pages/Register.jsx">Уже есть аккаунт? </Text>
            <Link data-easytag="id18-src/pages/Register.jsx" to="/login">Войти</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
