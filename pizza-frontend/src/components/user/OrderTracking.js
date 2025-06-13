import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress,
    Button,
    Box
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import StripeElementsProvider from '../payment/StripeElementsProvider';
import Bill from '../payment/Bill';
import API_BASE_URL from '../../config';

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPaymentFormForOrder, setShowPaymentFormForOrder] = useState(null);
    const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                return;
            }
            const response = await axios.get(`${API_BASE_URL}/api/orders/myorders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
            setLoading(false);
            setShowPaymentFormForOrder(null);
        } catch (error) {
            console.error("Error fetching user orders:", error);
            setError('Failed to fetch your orders.');
            setLoading(false);
        }
    };

    const handleMakePaymentClick = (order) => {
        setShowPaymentFormForOrder(order);
        setSelectedOrderForBill(null);
    };

    const handleViewBill = (order) => {
        setSelectedOrderForBill(order);
        setShowPaymentFormForOrder(null);
    };

    const handlePaymentSuccess = () => {
        setError('');
        fetchOrders();
    };

    const handlePaymentError = (errorMessage) => {
        setError(`Payment failed: ${errorMessage}`);
        setShowPaymentFormForOrder(null);
    };

    const getActiveStep = (status, paymentStatus) => {
        if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') return -1;
        switch (status) {
            case 'pending':
                return 0;
            case 'accepted':
                return paymentStatus === 'paid' ? 1 : 0;
            case 'processing':
                return 1;
            case 'delivered':
                return 2;
            case 'rejected':
            case 'cancelled':
                return -1;
            default:
                return 0;
        }
    };

    const getStatusSteps = (status, paymentStatus) => {
        if (status === 'rejected') {
            return ['Order Placed', 'Rejected by Admin'];
        } else if (status === 'cancelled') {
            return ['Order Placed', 'Cancelled'];
        } else if (status === 'accepted' && paymentStatus === 'pending') {
            return ['Order Accepted, Awaiting Payment', 'Order Processing', 'Delivered'];
        } else {
            return ['Order Placed', 'Processing', 'Delivered'];
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (selectedOrderForBill) {
        return (
            <Box sx={{ p: 2 }}>
                <Button 
                    variant="outlined" 
                    onClick={() => setSelectedOrderForBill(null)}
                    sx={{ mb: 2 }}
                >
                    Back to Orders
                </Button>
                <Bill order={selectedOrderForBill} />
            </Box>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Orders</h2>
            {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

            {showPaymentFormForOrder ? (
                <StripeElementsProvider 
                    key={showPaymentFormForOrder._id}
                    order={showPaymentFormForOrder}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            ) : orders.length === 0 ? (
                <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}>
                    No orders found
                </Typography>
            ) : (
                orders.map((order) => (
                    <Card key={order._id} sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                Order ID: {order._id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Order Date: {new Date(order.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Total Amount: ₹{order.totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Status: {order.status.toUpperCase()} / Payment: {order.paymentStatus.toUpperCase()}
                            </Typography>

                            <Stepper activeStep={getActiveStep(order.status, order.paymentStatus)} alternativeLabel sx={{ mb: 2 }}>
                                {getStatusSteps(order.status, order.paymentStatus).map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Items:</Typography>
                            {order.items.map((item, index) => (
                                <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                                    - {item.name} x {item.quantity} (₹{(item.price * item.quantity).toFixed(2)})
                                </Typography>
                            ))}
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                {order.status === 'accepted' && order.paymentStatus === 'pending' && (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleMakePaymentClick(order)}
                                    >
                                        Make Payment
                                    </Button>
                                )}
                                {order.paymentStatus === 'paid' && (
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={() => handleViewBill(order)}
                                    >
                                        View Bill
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};

export default OrderTracking;