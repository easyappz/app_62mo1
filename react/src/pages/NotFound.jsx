import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div data-easytag="id1-src/pages/NotFound.jsx" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Result
        data-easytag="id2-src/pages/NotFound.jsx"
        status="404"
        title="404"
        subTitle="Страница не найдена"
        extra={
          <Link data-easytag="id3-src/pages/NotFound.jsx" to="/">
            <Button data-easytag="id4-src/pages/NotFound.jsx" type="primary">На главную</Button>
          </Link>
        }
      />
    </div>
  );
}
