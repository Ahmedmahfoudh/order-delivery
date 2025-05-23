import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import { OrderTrackingInfo, TrackingHistory, OrderStatus, DeliveryStatus } from '../types';
import { trackingApi } from '../services/api';

const orderSteps = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.READY_FOR_DELIVERY,
    OrderStatus.IN_DELIVERY,
    OrderStatus.DELIVERED,
];

const deliverySteps = [
    DeliveryStatus.PENDING,
    DeliveryStatus.ASSIGNED,
    DeliveryStatus.PICKED_UP,
    DeliveryStatus.IN_TRANSIT,
    DeliveryStatus.DELIVERED,
];

export const OrderTrackingPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [trackingInfo, setTrackingInfo] = useState<OrderTrackingInfo | null>(null);
    const [history, setHistory] = useState<TrackingHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!orderId || isNaN(Number(orderId))) {
                setError('Invalid order ID');
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null); // Clear previous errors
                
                // Fetch tracking info
                try {
                    const trackingData = await trackingApi.getOrderTrackingInfo(Number(orderId));
                    
                    if (trackingData) {
                        // Validate and process the tracking data
                        const processedData = {
                            ...trackingData,
                            // Ensure orderStatus is a valid enum value
                            orderStatus: Object.values(OrderStatus).includes(trackingData.orderStatus as OrderStatus) 
                                ? trackingData.orderStatus as OrderStatus 
                                : OrderStatus.PENDING,
                                
                            // Ensure deliveryStatus is a valid enum value
                            deliveryStatus: Object.values(DeliveryStatus).includes(trackingData.deliveryStatus as DeliveryStatus) 
                                ? trackingData.deliveryStatus as DeliveryStatus 
                                : DeliveryStatus.PENDING,
                                
                            // Ensure totalAmount is a valid number
                            totalAmount: typeof trackingData.totalAmount === 'number' ? trackingData.totalAmount : 0,
                            
                            // Ensure dates are valid
                            orderDate: trackingData.orderDate ? trackingData.orderDate : new Date().toISOString(),
                            
                            // Ensure customer info is valid
                            customerName: trackingData.customerName || 'N/A',
                            customerAddress: trackingData.customerAddress || 'N/A',
                            
                            // Ensure carrier info is valid
                            carrierName: trackingData.carrierName || '',
                            carrierPhone: trackingData.carrierPhone || ''
                        };
                        
                        setTrackingInfo(processedData);
                    } else {
                        throw new Error('No tracking data received');
                    }
                } catch (err) {
                    console.error('Error fetching tracking info:', err);
                    setError('Failed to load order tracking information: ' + 
                        (err instanceof Error ? err.message : 'Unknown error'));
                    setTrackingInfo(null);
                }

                // Fetch tracking history
                try {
                    const historyData = await trackingApi.getOrderTrackingHistory(Number(orderId));
                    
                    if (Array.isArray(historyData)) {
                        const processedHistory = historyData.map(item => ({
                            ...item,
                            // Ensure orderStatus is a valid enum value
                            orderStatus: Object.values(OrderStatus).includes(item.orderStatus as OrderStatus) 
                                ? item.orderStatus as OrderStatus 
                                : OrderStatus.PENDING,
                                
                            // Ensure deliveryStatus is a valid enum value
                            deliveryStatus: Object.values(DeliveryStatus).includes(item.deliveryStatus as DeliveryStatus) 
                                ? item.deliveryStatus as DeliveryStatus 
                                : DeliveryStatus.PENDING,
                                
                            // Ensure timestamp is valid
                            timestamp: item.timestamp || new Date().toISOString(),
                            
                            // Ensure description is valid
                            description: item.description || 'No description available'
                        }));
                        setHistory(processedHistory);
                    } else {
                        console.error('History data is not an array:', historyData);
                        setHistory([]);
                    }
                } catch (err) {
                    console.error('Error fetching history:', err);
                    setHistory([]);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(`Failed to load tracking information: ${errorMessage}`);
                console.error('Error in fetchData:', err);
                setTrackingInfo(null);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !trackingInfo) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error || 'Order not found'}</Alert>
            </Container>
        );
    }

    // Safely handle the order status
    const currentOrderStep = trackingInfo.orderStatus && orderSteps.includes(trackingInfo.orderStatus) 
        ? orderSteps.indexOf(trackingInfo.orderStatus) 
        : 0;
    
    // Safely handle the delivery status
    const currentDeliveryStep = trackingInfo.deliveryStatus && deliverySteps.includes(trackingInfo.deliveryStatus)
        ? deliverySteps.indexOf(trackingInfo.deliveryStatus)
        : 0; // Use 0 instead of -1 to avoid Stepper errors

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Order Tracking
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Order Status
                </Typography>
                <Stepper activeStep={currentOrderStep} alternativeLabel>
                    {orderSteps.map((status) => (
                        <Step key={status}>
                            <StepLabel>{status.replace('_', ' ')}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {trackingInfo.deliveryStatus && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Delivery Status
                    </Typography>
                    <Stepper activeStep={currentDeliveryStep} alternativeLabel>
                        {deliverySteps.map((status) => (
                            <Step key={status}>
                                <StepLabel>{status.replace('_', ' ')}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Order Details
                            </Typography>
                            <Typography>Order ID: {trackingInfo.orderId}</Typography>
                            <Typography>Date: {trackingInfo.orderDate ? new Date(trackingInfo.orderDate).toLocaleDateString() : 'N/A'}</Typography>
                            <Typography>Total Amount: ${typeof trackingInfo.totalAmount === 'number' ? trackingInfo.totalAmount.toFixed(2) : '0.00'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Customer Information
                            </Typography>
                            <Typography>Name: {trackingInfo.customerName}</Typography>
                            <Typography>Address: {trackingInfo.customerAddress}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {trackingInfo.carrierName && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Carrier Information
                                </Typography>
                                <Typography>Name: {trackingInfo.carrierName}</Typography>
                                <Typography>Phone: {trackingInfo.carrierPhone}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Tracking History
                </Typography>
                {history.map((item) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {new Date(item.timestamp).toLocaleString()}
                        </Typography>
                        <Typography>{item.description}</Typography>
                    </Box>
                ))}
            </Paper>
        </Container>
    );
}; 