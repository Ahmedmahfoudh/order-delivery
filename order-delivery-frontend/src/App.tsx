import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { HomePage } from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import InventoryManagement from './components/InventoryManagement';
import SupplierManagement from './components/SupplierManagement';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tracking/:orderId" element={
              <ErrorBoundary>
                <OrderTrackingPage />
              </ErrorBoundary>
            } />
            <Route path="/inventory" element={
              <ErrorBoundary>
                <InventoryManagement />
              </ErrorBoundary>
            } />
            <Route path="/suppliers" element={
              <ErrorBoundary>
                <SupplierManagement />
              </ErrorBoundary>
            } />
            <Route path="/payments" element={
              <ErrorBoundary>
                <PaymentPage />
              </ErrorBoundary>
            } />
          </Routes>
        </Layout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 