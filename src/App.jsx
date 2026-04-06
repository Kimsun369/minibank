import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankProvider } from './context/BankContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';
import Layout from './components/Layout';
const PrivateRoute = ({
  children
}) => {
  const {
    isAuthenticated
  } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
const AppRoutes = () => {
  return <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute>
            <Layout>
              <Transactions />
            </Layout>
          </PrivateRoute>} />
      <Route path="/transfer" element={<PrivateRoute>
            <Layout>
              <Transfer />
            </Layout>
          </PrivateRoute>} />
      <Route path="/deposit" element={<PrivateRoute>
            <Layout>
              <Deposit />
            </Layout>
          </PrivateRoute>} />
      <Route path="/withdraw" element={<PrivateRoute>
            <Layout>
              <Withdraw />
            </Layout>
          </PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>} />
    </Routes>;
};
export default function App() {
  return <Router>
      <AuthProvider>
        <BankProvider>
          <AppRoutes />
        </BankProvider>
      </AuthProvider>
    </Router>;
}