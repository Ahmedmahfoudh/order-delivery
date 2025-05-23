import React from 'react';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, Box, Container, CssBaseline,
  IconButton, Divider, useTheme, useMediaQuery
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Order Tracking', icon: <LocalShippingIcon />, path: '/tracking/1' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Suppliers', icon: <BusinessIcon />, path: '/suppliers' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Order Delivery
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            selected={location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Order & Delivery Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px' 
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
