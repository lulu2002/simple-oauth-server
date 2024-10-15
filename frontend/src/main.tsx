import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {SSRProvider} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SSRProvider>
      <App/>
    </SSRProvider>;
  </StrictMode>,
)
