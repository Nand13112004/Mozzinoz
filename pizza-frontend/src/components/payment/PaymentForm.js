import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Alert, Button, CircularProgress, Box } from '@mui/material';
import Bill from './Bill';
import API_BASE_URL from '../../config';

const PaymentForm = ({ order, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showBill, setShowBill] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setMessage('Payment system is not ready. Please try again in a moment.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('info');

    try {
      // Store the order ID before redirect
      localStorage.setItem('currentOrderId', order._id);

      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        setMessage(submitError.message || 'An error occurred during payment.');
        setMessageType('error');
        onError?.(submitError.message);
        return;
      }

      // If we get here, the payment was successful
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const updateResponse = await axios.put(
        `${API_BASE_URL}/api/orders/${order._id}/pay`,
        {
          paymentMethod: 'card',
          status: 'paid'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setUpdatedOrder(updateResponse.data);
      setShowBill(true);
      setMessage('Payment successful!');
      setMessageType('success');
      onSuccess?.();
    } catch (err) {
      console.error('Payment error:', err);
      setMessage(err.response?.data?.message || err.message || 'Payment failed');
      setMessageType('error');
      onError?.(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showBill && updatedOrder) {
    return <Bill order={updatedOrder} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 2 }}>
        {message && (
          <Alert severity={messageType} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <PaymentElement />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!stripe || loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Pay Now'}
        </Button>
      </Box>
    </form>
  );
};

export default PaymentForm;