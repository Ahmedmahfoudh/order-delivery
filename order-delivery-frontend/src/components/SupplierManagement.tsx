import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField,
  Box, Alert, Tabs, Tab, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import axios from 'axios';

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface Order {
  id: number;
  date: string;
  status: string;
  totalAmount: number;
  customer: {
    name: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`supplier-tabpanel-${index}`}
      aria-labelledby={`supplier-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `supplier-tab-${index}`,
    'aria-controls': `supplier-tabpanel-${index}`,
  };
}

const initialSupplierState: Supplier = {
  id: 0,
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
};

const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierOrders, setSupplierOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  
  // Dialog states
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier>(initialSupplierState);
  const [editMode, setEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedSupplierForProduct, setSelectedSupplierForProduct] = useState<number | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching suppliers...');
      const response = await axios.get('http://localhost:8080/api/suppliers');
      
      // Process the response data
      let suppliersArray = [];
      
      if (response && response.data) {
        console.log('Raw suppliers response:', response.data);
        
        if (Array.isArray(response.data)) {
          // If it's already an array, use it directly
          suppliersArray = response.data;
        } else if (typeof response.data === 'object') {
          // If it's an object, try to extract suppliers
          if (response.data.content && Array.isArray(response.data.content)) {
            // Spring Data format with pagination
            suppliersArray = response.data.content;
          } else if (response.data.suppliers && Array.isArray(response.data.suppliers)) {
            // Nested suppliers array
            suppliersArray = response.data.suppliers;
          } else {
            // Try to convert object to array if it has numeric keys
            const possibleArray = Object.values(response.data);
            if (possibleArray.length > 0) {
              suppliersArray = possibleArray;
            }
          }
        }
        
        // Validate suppliers
        const validSuppliers = suppliersArray.filter((item: any) => {
          return item && typeof item === 'object' && 
                 (typeof item.id === 'number' || typeof item.id === 'string');
        });
        
        console.log('Processed suppliers:', validSuppliers.length);
        setSuppliers(validSuppliers);
        setError(null);
      } else {
        console.warn('No suppliers data received');
        setSuppliers([]);
        setError('No data received from API');
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      
      // Ensure we have an array of products
      if (response.data) {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Products API response is not an array:', response.data);
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    }
  };

  const fetchSupplierOrders = async (supplierId: number) => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      
      console.log(`Fetching orders for supplier ${supplierId}...`);
      const response = await axios.get(`http://localhost:8080/api/suppliers/${supplierId}/orders`);
      
      // Process the response data
      let ordersArray = [];
      
      if (response && response.data) {
        console.log('Raw orders response:', response.data);
        
        if (Array.isArray(response.data)) {
          // If it's already an array, use it directly
          ordersArray = response.data;
        } else if (typeof response.data === 'object') {
          // If it's an object, try to extract orders
          if (response.data.content && Array.isArray(response.data.content)) {
            // Spring Data format with pagination
            ordersArray = response.data.content;
          } else if (response.data.orders && Array.isArray(response.data.orders)) {
            // Nested orders array
            ordersArray = response.data.orders;
          } else {
            // Try to convert object to array if it has numeric keys
            const possibleArray = Object.values(response.data);
            if (possibleArray.length > 0) {
              ordersArray = possibleArray;
            }
          }
        }
        
        // Validate orders
        const validOrders = ordersArray.filter((item: any) => {
          return item && typeof item === 'object' && 
                 (typeof item.id === 'number' || typeof item.id === 'string');
        });
        
        console.log('Processed orders:', validOrders.length);
        setSupplierOrders(validOrders);
        setOrdersError(null);
        
        // Calculate total revenue
        try {
          const total = validOrders.reduce((sum: number, order: any) => {
            const amount = typeof order.totalAmount === 'number' ? order.totalAmount : 0;
            return sum + amount;
          }, 0);
          setTotalRevenue(total);
        } catch (calcErr) {
          console.error('Error calculating total revenue:', calcErr);
          setTotalRevenue(0);
        }
      } else {
        console.warn('No orders data received');
        setSupplierOrders([]);
        setOrdersError('No data received from API');
        setTotalRevenue(0);
      }
    } catch (err) {
      console.error('Error fetching supplier orders:', err);
      setSupplierOrders([]);
      setOrdersError('Failed to fetch supplier orders: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setTotalRevenue(0);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSupplierSelect = (supplierId: number) => {
    setSelectedSupplierId(supplierId);
    fetchSupplierOrders(supplierId);
  };

  const handleOpenSupplierDialog = (supplier?: Supplier) => {
    if (supplier) {
      setCurrentSupplier(supplier);
      setEditMode(true);
    } else {
      setCurrentSupplier(initialSupplierState);
      setEditMode(false);
    }
    setOpenSupplierDialog(true);
  };

  const handleCloseSupplierDialog = () => {
    setOpenSupplierDialog(false);
  };

  const handleOpenAssignDialog = (productId: number) => {
    setSelectedProductId(productId);
    setSelectedSupplierForProduct(null);
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSupplierSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:8080/api/suppliers/${currentSupplier.id}`, currentSupplier);
      } else {
        await axios.post('http://localhost:8080/api/suppliers', currentSupplier);
      }
      fetchSuppliers();
      handleCloseSupplierDialog();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to save supplier: ${errorMessage}`);
      console.error('Error saving supplier:', err);
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
      fetchSuppliers();
      if (selectedSupplierId === id) {
        setSelectedSupplierId(null);
        setSupplierOrders([]);
        setTotalRevenue(0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to delete supplier: ${errorMessage}`);
      console.error('Error deleting supplier:', err);
    }
  };

  const handleSupplierForProductChange = (event: SelectChangeEvent<number>) => {
    setSelectedSupplierForProduct(event.target.value as number);
  };

  const handleAssignSupplier = async () => {
    if (!selectedProductId || !selectedSupplierForProduct) return;
    
    try {
      await axios.put(
        `http://localhost:8080/api/suppliers/products/${selectedProductId}/assign?supplierId=${selectedSupplierForProduct}`
      );
      fetchProducts();
      handleCloseAssignDialog();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to assign supplier to product: ${errorMessage}`);
      console.error('Error assigning supplier:', err);
    }
  };

  const loadInitialData = useCallback(() => {
    fetchSuppliers();
    fetchProducts();
    
    // If there's a selected supplier, fetch its orders
    if (selectedSupplierId) {
      fetchSupplierOrders(selectedSupplierId);
    }
  }, [selectedSupplierId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="supplier tabs">
          <Tab label="Suppliers" {...a11yProps(0)} />
          <Tab label="Products by Supplier" {...a11yProps(1)} />
          <Tab label="Order History" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            All Suppliers
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenSupplierDialog()}
          >
            Add New Supplier
          </Button>
        </Box>
        
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
                  <TableCell>Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No suppliers found</TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.id}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small" 
                          onClick={() => handleOpenSupplierDialog(supplier)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small" 
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          sx={{ mr: 1 }}
                        >
                          Delete
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="info" 
                          size="small" 
                          onClick={() => handleSupplierSelect(supplier.id)}
                        >
                          View Orders
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Products by Supplier
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No products found</TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${product.price?.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>Not available</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small" 
                        onClick={() => handleOpenAssignDialog(product.id)}
                      >
                        Assign Supplier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {selectedSupplierId ? (
          <>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Orders from {suppliers.find(s => s.id === selectedSupplierId)?.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Total Revenue: ${totalRevenue.toFixed(2)}
              </Typography>
            </Box>
            
            {ordersLoading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : ordersError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {ordersError}
              </Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplierOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No orders found for this supplier</TableCell>
                      </TableRow>
                    ) : (
                      supplierOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                          <TableCell>{order.status || 'N/A'}</TableCell>
                          <TableCell>${typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : '0.00'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <Alert severity="info">
            Please select a supplier from the Suppliers tab to view order history.
          </Alert>
        )}
      </TabPanel>

      {/* Supplier Dialog */}
      <Dialog open={openSupplierDialog} onClose={handleCloseSupplierDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              value={currentSupplier.name}
              onChange={handleSupplierChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={currentSupplier.contactPerson}
              onChange={handleSupplierChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={currentSupplier.email}
              onChange={handleSupplierChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Phone"
              name="phone"
              value={currentSupplier.phone}
              onChange={handleSupplierChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Address"
              name="address"
              value={currentSupplier.address}
              onChange={handleSupplierChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={currentSupplier.notes}
              onChange={handleSupplierChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSupplierDialog}>Cancel</Button>
          <Button onClick={handleSupplierSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Supplier Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog}>
        <DialogTitle>Assign Supplier to Product</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="supplier-select-label">Supplier</InputLabel>
            <Select
              labelId="supplier-select-label"
              value={selectedSupplierForProduct || ''}
              label="Supplier"
              onChange={handleSupplierForProductChange}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button 
            onClick={handleAssignSupplier} 
            variant="contained" 
            color="primary"
            disabled={!selectedSupplierForProduct}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupplierManagement;
