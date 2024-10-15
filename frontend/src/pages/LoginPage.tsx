import React, {useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {Link} from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Login successful!');
  };

  return (
    <Container>
      <h1 className="text-center my-5">街口登入</h1>
      <Row className="justify-content-center">
        <Col md={4}>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>使用者名稱</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入使用者名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button type="submit" variant="primary">
                登入
              </Button>
            </div>
            <div className="text-center mt-3">
              <Link to="/register">
                <Button variant="link">註冊</Button>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
