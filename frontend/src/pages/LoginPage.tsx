import React, {useState} from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt:', {username, password});
    alert('Login successful!');
  };

  return (
    <div className="container">
      <h1 className="text-center my-5">街口登入</h1>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">使用者名稱</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="輸入使用者名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">密碼</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">登入</button>
            </div>
            <div className="text-center mt-3">
              <a href="#" className="btn btn-link">註冊</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
