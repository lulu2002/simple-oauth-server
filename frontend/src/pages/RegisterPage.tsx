import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {useState} from 'react';
import {Link} from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Container>
      <h1 className="text-center my-5">註冊帳號</h1>
      <Row className="justify-content-center">
        <Col md={4}>
          <Form>
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

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>電子郵件</Form.Label>
              <Form.Control
                type="email"
                placeholder="輸入電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>確認密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="再次輸入密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" variant="primary">
                註冊
              </Button>
            </div>

            <div className="text-center mt-3">
              <Link to="/login">
                <Button variant="link">已有帳號？登入</Button>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
