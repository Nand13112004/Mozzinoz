import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded' && paymentIntent) {
      const updateOrderStatus = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication token not found');
          }

          // Get the order ID from localStorage (we should have stored it before redirect)
          const orderId = localStorage.getItem('currentOrderId');
          if (!orderId) {
            throw new Error('Order ID not found');
          }

          // Update the order status
          await axios.put(
            `${API_BASE_URL}/api/orders/${orderId}/pay`,
            {
              paymentMethod: 'card',
              status: 'paid',
              paymentIntentId: paymentIntent
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          // Clear the stored order ID
          localStorage.removeItem('currentOrderId');

          // Redirect to orders page after a short delay
          setTimeout(() => {
            navigate('/orders');
          }, 3000);
        } catch (err) {
          console.error('Error updating order status:', err);
          setError(err.response?.data?.message || err.message);
        } finally {
          setLoading(false);
        }
      };

      updateOrderStatus();
    } else {
      setError('Payment verification failed');
      setLoading(false);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying your payment...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Please contact support if you need assistance.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Alert severity="success" sx={{ mb: 2 }}>
        Payment successful!
      </Alert>
      <Typography variant="h6">
        Thank you for your payment. You will be redirected to your orders page shortly.
      </Typography>
    </Box>
  );
};

export default PaymentSuccess; 