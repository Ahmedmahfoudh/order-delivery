import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
} from '@mui/material';

export const HomePage = () => {
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId.trim()) {
            navigate(`/tracking/${orderId}`);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Order Tracking
                </Typography>
                <Typography variant="body1" gutterBottom align="center" color="text.secondary">
                    Enter your order ID to track your delivery
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        margin="normal"
                        required
                        type="number"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3 }}
                    >
                        Track Order
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}; 