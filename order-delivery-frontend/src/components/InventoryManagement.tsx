import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField,
  Grid, Box, Alert, Tabs, Tab, CircularProgress
} from '@mui/material';
import { inventoryApi, Product } from '../services/inventoryApi';

// Using Product interface from inventoryApi.ts

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
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
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
    id: `inventory-tab-${index}`,
    'aria-controls': `inventory-tabpanel-${index}`,
  };
}

const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [threshold, setThreshold] = useState<number>(5);
  const [editingProduct, setEditingProduct] = useState<{id: number, stock: number} | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Define the fetch function with useCallback to avoid dependency issues
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products...');
      
      // Fetch products using the inventoryApi service
      const data = await inventoryApi.getAllProducts();
      
      console.log('Products fetched successfully:', data.length, 'products');
      
      // Set all products
      setProducts(data);
      
      // Process product data for different views
      if (data.length > 0) {
        try {
          console.log('Processing product data...');
          
          // Log the first product for debugging
          if (data[0]) {
            console.log('Sample product:', JSON.stringify(data[0]));
          }
          
          // Filter low stock products
          const lowStock = data.filter((product: Product) => {
            return product && 
                   typeof product.stock === 'number' && 
                   product.stock > 0 && 
                   product.stock <= threshold;
          });
          console.log('Low stock products:', lowStock.length);
          setLowStockProducts(lowStock || []);
          
          // Filter out of stock products
          const outOfStock = data.filter((product: Product) => {
            return product && 
                   typeof product.stock === 'number' && 
                   product.stock === 0;
          });
          console.log('Out of stock products:', outOfStock.length);
          setOutOfStockProducts(outOfStock || []);
          
          // Calculate total inventory value
          const total = data.reduce((sum: number, product: Product) => {
            if (!product) return sum;
            const price = typeof product.price === 'number' ? product.price : 0;
            const stock = typeof product.stock === 'number' ? product.stock : 0;
            return sum + (price * stock);
          }, 0);
          console.log('Total inventory value:', total);
          setTotalValue(total);
        } catch (filterErr) {
          console.error('Error processing product data:', filterErr);
          // Don't throw here, just set default values
          setLowStockProducts([]);
          setOutOfStockProducts([]);
          setTotalValue(0);
        }
      } else {
        console.warn('No products data received');
        // Reset states if no data
        setLowStockProducts([]);
        setOutOfStockProducts([]);
        setTotalValue(0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // Provide more detailed error information
      let errorMessage = 'Failed to fetch products';
      if (err instanceof Error) {
        errorMessage += ': ' + err.message;
        console.error('Error details:', err.stack);
      } else {
        errorMessage += ': Unknown error';
        console.error('Unknown error object:', err);
      }
      setError(errorMessage);
      setProducts([]);
      setLowStockProducts([]);
      setOutOfStockProducts([]);
      setTotalValue(0);
    } finally {
      setLoading(false);
    }
  }, [threshold]);
  
  // Function to update product stock using inventoryApi
  const updateStock = async (productId: number, newStock: number) => {
    try {
      setError(null);
      
      // Update the product stock using the inventoryApi service
      const updatedProduct = await inventoryApi.updateProductStock(productId, newStock);
      console.log('Stock updated successfully:', updatedProduct);
      
      // Update the product in the local state immediately for better UX
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
      
      // Also update low stock and out of stock lists
      setLowStockProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
      
      setOutOfStockProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
      
      // Reset editing state
      setEditingProduct(null);
      
      // Refresh data to ensure everything is in sync
      fetchData();
      
    } catch (err) {
      console.error('Error updating stock:', err);
      setError('Failed to update stock: ' + (err instanceof Error ? err.message : 'Unknown error'));
      // Still reset editing state even on error
      setEditingProduct(null);
    }
  };
  
  // Load data on component mount and when threshold changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // This effect is no longer needed as it's handled by the main useEffect
  // that calls safelyFetchData

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="inventory tabs">
          <Tab label="All Products" {...a11yProps(0)} />
          <Tab label="Low Stock" {...a11yProps(1)} />
          <Tab label="Out of Stock" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Total Inventory Value: ${totalValue.toFixed(2)}
        </Typography>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          All Products
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
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</TableCell>
                    <TableCell>
                      {editingProduct && editingProduct.id === product.id ? (
                        <TextField
                          type="number"
                          size="small"
                          value={editingProduct.stock}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsedValue = value === '' ? 0 : parseInt(value);
                            setEditingProduct({...editingProduct, stock: isNaN(parsedValue) ? 0 : parsedValue});
                          }}
                        />
                      ) : (
                        <span style={{ color: product.stock <= 0 ? 'red' : product.stock < 5 ? 'orange' : 'inherit' }}>
                          {product.stock}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct && editingProduct.id === product.id ? (
                        <>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small" 
                            onClick={() => updateStock(product.id, editingProduct.stock)}
                            sx={{ mr: 1 }}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="secondary" 
                            size="small" 
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small" 
                          onClick={() => setEditingProduct({id: product.id, stock: product.stock})}
                        >
                          Edit Stock
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="h6">
              Low Stock Products
            </Typography>
          </Grid>
          <Grid item xs>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2 }}>
                Threshold:
              </Typography>
              <TextField
                type="number"
                size="small"
                value={threshold}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === '' ? 5 : parseInt(value);
                  setThreshold(isNaN(parsedValue) ? 5 : Math.max(1, parsedValue));
                }}
                inputProps={{ min: 1 }}
                sx={{ width: 100 }}
              />
            </Box>
          </Grid>
        </Grid>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No products with low stock</TableCell>
                </TableRow>
              ) : (
                lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</TableCell>
                    <TableCell>
                      {editingProduct && editingProduct.id === product.id ? (
                        <TextField
                          type="number"
                          size="small"
                          value={editingProduct.stock}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsedValue = value === '' ? 0 : parseInt(value);
                            setEditingProduct({...editingProduct, stock: isNaN(parsedValue) ? 0 : parsedValue});
                          }}
                        />
                      ) : (
                        <span style={{ color: product.stock <= 0 ? 'red' : 'orange' }}>
                          {product.stock}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct && editingProduct.id === product.id ? (
                        <>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small" 
                            onClick={() => updateStock(product.id, editingProduct.stock)}
                            sx={{ mr: 1 }}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="secondary" 
                            size="small" 
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small" 
                          onClick={() => setEditingProduct({id: product.id, stock: product.stock})}
                        >
                          Edit Stock
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Out of Stock Products
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outOfStockProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No products out of stock</TableCell>
                </TableRow>
              ) : (
                outOfStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</TableCell>
                    <TableCell>
                      {editingProduct && editingProduct.id === product.id ? (
                        <TextField
                          type="number"
                          size="small"
                          value={editingProduct.stock}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsedValue = value === '' ? 0 : parseInt(value);
                            setEditingProduct({...editingProduct, stock: isNaN(parsedValue) ? 0 : parsedValue});
                          }}
                        />
                      ) : (
                        <span style={{ color: 'red' }}>
                          {product.stock}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct && editingProduct.id === product.id ? (
                        <>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small" 
                            onClick={() => updateStock(product.id, editingProduct.stock)}
                            sx={{ mr: 1 }}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="secondary" 
                            size="small" 
                            onClick={() => setEditingProduct(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small" 
                          onClick={() => setEditingProduct({id: product.id, stock: product.stock})}
                        >
                          Edit Stock
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Container>
  );
};

export default InventoryManagement;
