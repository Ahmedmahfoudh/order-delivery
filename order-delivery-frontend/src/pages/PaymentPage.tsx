import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';

// Define payment status types
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Define payment method types
type PaymentMethod = 'credit_card' | 'bank_transfer' | 'paypal' | 'cash';

// Define payment interface
interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  date: string;
  customerName: string;
  reference: string;
}

// Mock data for payments
const mockPayments: Payment[] = [
  {
    id: 1,
    orderId: 1001,
    amount: 245.99,
    status: 'completed',
    method: 'credit_card',
    date: '2025-05-20T14:30:00',
    customerName: 'John Smith',
    reference: 'PAY-1001-XYZ'
  },
  {
    id: 2,
    orderId: 1002,
    amount: 125.50,
    status: 'pending',
    method: 'bank_transfer',
    date: '2025-05-21T09:15:00',
    customerName: 'Sarah Johnson',
    reference: 'PAY-1002-ABC'
  },
  {
    id: 3,
    orderId: 1003,
    amount: 78.25,
    status: 'completed',
    method: 'paypal',
    date: '2025-05-22T16:45:00',
    customerName: 'Michael Brown',
    reference: 'PAY-1003-DEF'
  },
  {
    id: 4,
    orderId: 1004,
    amount: 320.00,
    status: 'failed',
    method: 'credit_card',
    date: '2025-05-23T11:20:00',
    customerName: 'Emily Wilson',
    reference: 'PAY-1004-GHI'
  },
  {
    id: 5,
    orderId: 1005,
    amount: 95.75,
    status: 'refunded',
    method: 'paypal',
    date: '2025-05-19T13:10:00',
    customerName: 'David Lee',
    reference: 'PAY-1005-JKL'
  }
];

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get color based on payment status
const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    case 'refunded':
      return 'info';
    default:
      return 'default';
  }
};

// Helper function to get payment method display name
const getMethodDisplay = (method: PaymentMethod): string => {
  switch (method) {
    case 'credit_card':
      return 'Credit Card';
    case 'bank_transfer':
      return 'Bank Transfer';
    case 'paypal':
      return 'PayPal';
    case 'cash':
      return 'Cash';
    default:
      return method;
  }
};

export const PaymentPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    refunded: 0
  });

  // Function to fetch payments data
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, we would fetch from the API
      // const response = await api.get('/payments');
      // const data = response.data;
      
      // Using mock data for now
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = mockPayments;
      
      setPayments(data);
      
      // Calculate statistics
      const total = data.reduce((sum, payment) => sum + payment.amount, 0);
      const completed = data.filter(p => p.status === 'completed').length;
      const pending = data.filter(p => p.status === 'pending').length;
      const failed = data.filter(p => p.status === 'failed').length;
      const refunded = data.filter(p => p.status === 'refunded').length;
      
      setStats({
        total,
        completed,
        pending,
        failed,
        refunded
      });
      
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Function to process a payment (mock implementation)
  const processPayment = (paymentId: number) => {
    setPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'completed' } 
          : payment
      )
    );
  };

  // Function to refund a payment (mock implementation)
  const refundPayment = (paymentId: number) => {
    setPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'refunded' } 
          : payment
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Payment Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Payments
              </Typography>
              <Typography variant="h5" component="div">
                ${stats.total.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h5" component="div" color="success.main">
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h5" component="div" color="warning.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Failed
              </Typography>
              <Typography variant="h5" component="div" color="error.main">
                {stats.failed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Refunded
              </Typography>
              <Typography variant="h5" component="div" color="info.main">
                {stats.refunded}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Payments
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No payment records found</TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>{payment.customerName}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{getMethodDisplay(payment.method)}</TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)} 
                          color={getStatusColor(payment.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {payment.status === 'pending' && (
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            size="small" 
                            onClick={() => processPayment(payment.id)}
                            sx={{ mr: 1 }}
                          >
                            Process
                          </Button>
                        )}
                        {payment.status === 'completed' && (
                          <Button 
                            variant="outlined" 
                            color="secondary" 
                            size="small" 
                            onClick={() => refundPayment(payment.id)}
                          >
                            Refund
                          </Button>
                        )}
                        {payment.status === 'failed' && (
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            size="small" 
                            onClick={() => processPayment(payment.id)}
                          >
                            Retry
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default PaymentPage;
