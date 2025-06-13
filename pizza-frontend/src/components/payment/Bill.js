import React from 'react';
import { Paper, Typography, Box, Divider, Grid } from '@mui/material';

const Bill = ({ order }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pizza Shop
        </Typography>
        <Typography variant="subtitle1">
          Thank you for your order!
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Order ID:</Typography>
          <Typography variant="body2">{order._id}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Date:</Typography>
          <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Payment Status:</Typography>
          <Typography variant="body2" color="success.main">
            {order.paymentStatus.toUpperCase()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Payment Method:</Typography>
          <Typography variant="body2">{order.paymentMethod}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Order Items
      </Typography>

      {order.items.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">
                {item.quantity}x {item.name}
              </Typography>
              {item.base && (
                <Typography variant="body2" color="text.secondary">
                  Base: {item.base}
                </Typography>
              )}
              {item.sauce && (
                <Typography variant="body2" color="text.secondary">
                  Sauce: {item.sauce}
                </Typography>
              )}
              {item.cheese && (
                <Typography variant="body2" color="text.secondary">
                  Cheese: {item.cheese}
                </Typography>
              )}
              {item.veggies && item.veggies.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Veggies: {item.veggies.join(', ')}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1">
                ₹{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h6">
          Total Amount: ₹{order.totalAmount.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Thank you for choosing Pizza Shop!
        </Typography>
      </Box>
    </Paper>
  );
};

export default Bill; 