import { Header } from "./components/Header";
import { BrowserRouter as Router, Route, Routes, useNavigate, Outlet } from 'react-router-dom';
import { Login } from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Dashboard } from "./components/Dashboard";
import { NotFound } from "./components/NotFound";
import { EmployeeList } from "./components/EmployeeList";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user')); 
        navigate('/dashboard')
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate('/login'); 
      }
    } else {
      navigate('/login'); 
    }
  }, []);

  return (
    <>
      <div>
      <ToastContainer position="bottom-right" />
  
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes children={<Outlet />} />} >
          <Route path="/dashboard" element= {<Dashboard />} />
          <Route path="/employee-list" element={<EmployeeList />} />
         </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
