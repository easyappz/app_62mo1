import React, { useEffect, useMemo, useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { getMe, updateMe } from '../api/profile';

const { Title } = Typography;

const setFormServerErrors = (form, data) => {
  if (!data || typeof data !== 'object') return;
  const fieldErrors = [];
  Object.keys(data).forEach((key) => {
    const val = data[key];
    if (Array.isArray(val)) fieldErrors.push({ name: key, errors: val.map(String) });
    else if (typeof val === 'string') fieldErrors.push({ name: key, errors: [String(val)] });
  });
  if (fieldErrors.length) form.setFields(fieldErrors);
};

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const initialValues = useMemo(() => ({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  }), [user]);

  useEffect(() => {
    // If user context empty, fetch current profile
    const needFetch = !user || !user.email;
    if (needFetch) {
      setInitializing(true);
      getMe()
        .then((me) => {
          setUser(me);
          form.setFieldsValue({
            email: me?.email || '',
            first_name: me?.first_name || '',
            last_name: me?.last_name || '',
          });
        })
        .finally(() => setInitializing(false));
    } else {
      form.setFieldsValue(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
      };
      const updated = await updateMe(payload);
      setUser(updated);
      form.setFieldsValue({
        email: updated?.email || '',
        first_name: updated?.first_name || '',
        last_name: updated?.last_name || '',
      });
      message.success('Профиль обновлён');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.detail) message.error(String(data.detail));
      setFormServerErrors(form, data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-src/pages/Profile.jsx" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Card data-easytag="id2-src/pages/Profile.jsx" style={{ width: 640, maxWidth: '100%' }}>
        <Title data-easytag="id3-src/pages/Profile.jsx" level={3} style={{ marginBottom: 8 }}>Профиль</Title>
        <Form
          data-easytag="id4-src/pages/Profile.jsx"
          layout="vertical"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          disabled={initializing}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            data-easytag="id5-src/pages/Profile.jsx"
            name="email"
            label="Почта"
            rules={[{ required: true, message: 'Введите почту' }, { type: 'email', message: 'Некорректная почта' }]}
          >
            <Input data-easytag="id6-src/pages/Profile.jsx" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            data-easytag="id7-src/pages/Profile.jsx"
            name="first_name"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input data-easytag="id8-src/pages/Profile.jsx" placeholder="Иван" />
          </Form.Item>

          <Form.Item
            data-easytag="id9-src/pages/Profile.jsx"
            name="last_name"
            label="Фамилия"
            rules={[{ required: true, message: 'Введите фамилию' }]}
          >
            <Input data-easytag="id10-src/pages/Profile.jsx" placeholder="Иванов" />
          </Form.Item>

          <Form.Item data-easytag="id11-src/pages/Profile.jsx">
            <Button data-easytag="id12-src/pages/Profile.jsx" type="primary" htmlType="submit" loading={loading}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
