import React from 'react';
import { 
  Grid, Card, CardContent, Typography, CardActions, 
  Button, Box, Paper, useTheme 
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import DashboardIcon from '@mui/icons-material/Dashboard';

const features = [
  {
    title: 'Order Tracking',
    description: 'Track the status of orders and deliveries',
    icon: <TrackChangesIcon fontSize="large" />,
    path: '/',
    color: '#1976d2'
  },
  {
    title: 'Inventory Management',
    description: 'Manage product stock and inventory levels',
    icon: <InventoryIcon fontSize="large" />,
    path: '/inventory',
    color: '#2e7d32'
  },
  {
    title: 'Supplier Management',
    description: 'Manage suppliers and view order history by supplier',
    icon: <BusinessIcon fontSize="large" />,
    path: '/suppliers',
    color: '#d32f2f'
  },
  {
    title: 'Delivery Management',
    description: 'Manage deliveries and carriers',
    icon: <LocalShippingIcon fontSize="large" />,
    path: '/deliveries',
    color: '#ed6c02'
  },
  {
    title: 'Payment Processing',
    description: 'Process and manage payments',
    icon: <PaymentIcon fontSize="large" />,
    path: '/payments',
    color: '#9c27b0'
  },
  {
    title: 'Analytics Dashboard',
    description: 'View sales and performance metrics',
    icon: <DashboardIcon fontSize="large" />,
    path: '/dashboard',
    color: '#0288d1'
  }
];

export const DashboardPage: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          backgroundColor: theme.palette.primary.main + '10',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Order & Delivery Management System
        </Typography>
        <Typography variant="subtitle1">
          Welcome to the order and delivery management system. Use the navigation menu or the cards below to access different features.
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4
                }
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: feature.color + '20',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ color: feature.color, mr: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h2">
                  {feature.title}
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={Link} 
                  to={feature.path}
                  sx={{ color: feature.color }}
                >
                  Access
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
