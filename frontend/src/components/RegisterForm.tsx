import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useState} from "react";


interface RegisterFormProps {
  onSubmit: (email: string, password: string) => void;
  isError: boolean;
  loginLink: string;
  keepQuery: boolean;
}

const RegisterForm = (props: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitTried, setSubmitTried] = useState(false);

  const search = props.keepQuery ? window.location.search : '';

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col md={4}>
            <Form onSubmit={(e) => {
              e.preventDefault();
              setSubmitTried(true);

              if (password !== confirmPassword) {
                return;
              }

              props.onSubmit(email, password);
            }}>
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
                  isInvalid={confirmPassword !== password && submitTried}
                />
                {confirmPassword !== password && submitTried && (
                  <Form.Control.Feedback type="invalid">
                    密碼不一致
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="primary">
                  註冊
                </Button>
              </div>

              <div className="text-center mt-3">
                <Link to={{pathname: props.loginLink, search: search}}>
                  <Button variant="link">已有帳號？登入</Button>
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );

}

export default RegisterForm;