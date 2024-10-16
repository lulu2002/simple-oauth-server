import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import LoginPageViewModel from "./pages/LoginPage/LoginPageViewModel.tsx";
import QueryParamsImpl from "./application/QueryParamsImpl.ts";
import {AxiosClientImpl} from "@src/application/AxiosClientImpl.ts";

function App() {

  const queryParams = new QueryParamsImpl();
  const client = new AxiosClientImpl(import.meta.env.VITE_API_URL);

  return (
    <>
      <Router basename={"/"}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage viewModel={new LoginPageViewModel(queryParams, client)}/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
