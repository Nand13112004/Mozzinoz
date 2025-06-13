import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Alert, CircularProgress, Box } from '@mui/material';
import PaymentForm from './PaymentForm';
import API_BASE_URL from '../../config';

// Use a fallback key if the environment variable is not set
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RQKeqCrElGQKVZvxuXrzNgoQ3T2Lh3XMCdOy0ZMYQKWZQHcrXzmTsWWdgvjH9uBlCWNyLzs8uFvdsp4Zt4uFv0Z00gaBVFgK0';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const StripeElementsProvider = ({ order, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!order?._id) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/orders/${order._id}/create-payment-intent`,
          { amount: order.total },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data?.clientSecret) {
          setClientSecret(response.data.clientSecret);
        } else {
          throw new Error('No client secret received from server');
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError(`Failed to process payment: ${err.response?.data?.message || err.message}`);
        onError?.(err.response?.data?.message || err.message);
      }
      setLoading(false);
    };

    createPaymentIntent();
  }, [order?._id, order?.total]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!clientSecret) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Unable to initialize payment. Please try again.</Alert>
      </Box>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm order={order} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeElementsProvider;