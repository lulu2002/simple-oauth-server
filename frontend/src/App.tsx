import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import LoginPageViewModel from "./pages/LoginPage/LoginPageViewModel.tsx";
import QueryParamsImpl from "./application/QueryParamsImpl.ts";

function App() {

  const queryParams = new QueryParamsImpl();


  return (
    <>
      <Router basename={"/app"}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage viewModel={new LoginPageViewModel(queryParams)}/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
