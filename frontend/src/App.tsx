import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import LoginPageViewModel from "./pages/LoginPage/LoginPageViewModel.tsx";
import RegisterPage from "@src/pages/RegisterPage/RegisterPage.tsx";
import QueryParamsImpl from "@src/application/query/QueryParamsImpl.ts";
import AuthProxyAxios from "@src/adapters/auth/AuthProxyAxios.ts";
import axios from "axios";
import RegisterPageViewModel from "@src/pages/RegisterPage/RegisterPageViewModel.ts";

function App() {

  const queryParams = new QueryParamsImpl();
  const proxy = new AuthProxyAxios(axios.create({baseURL: import.meta.env.VITE_API_URL}));

  return (
    <>
      <Router basename={"/"}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage viewModel={new LoginPageViewModel(queryParams, proxy)}/>}/>
            <Route path="/register" element={<RegisterPage viewModel={new RegisterPageViewModel(proxy)}/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
