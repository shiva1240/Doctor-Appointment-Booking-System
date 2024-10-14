import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import AdminContextPrvider from './context/AdminContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AdminContextPrvider>
    <DoctorContextProvider>
      <AppContextProvider>
    <App />
    </AppContextProvider>
    </DoctorContextProvider>
    </AdminContextPrvider>
  </BrowserRouter>,
)
