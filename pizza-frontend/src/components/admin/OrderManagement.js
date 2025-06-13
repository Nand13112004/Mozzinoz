import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Chip
} from '@mui/material';
import API_BASE_URL from '../../config';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                return;
            }
            const response = await axios.get(`${API_BASE_URL}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            setError('Failed to fetch orders');
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                return;
            }
            await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchOrders();
        } catch (error) {
            setError('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'default';
            case 'orderReceived':
                return 'primary';
            case 'inKitchen':
                return 'secondary';
            case 'sentToDelivery':
                return 'info';
            case 'delivered':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Order Management</h2>
            {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>{order.user?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.quantity}x {item.name}
                                            {item.veggies && item.veggies.length > 0 && (
                                                <span> (Veggies: {item.veggies.join(', ')})</span>
                                            )}
                                            {item.base && <span> (Base: {item.base})</span>}
                                            {item.sauce && <span> (Sauce: {item.sauce})</span>}
                                            {item.cheese && <span> (Cheese: {item.cheese})</span>}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.paymentStatus.toUpperCase()}
                                        color={order.paymentStatus === 'paid' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormControl size="small" style={{ minWidth: 120 }}>
                                        <InputLabel>Update Status</InputLabel>
                                        <Select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            label="Update Status"
                                        >
                                            <MenuItem value="pending" disabled={order.status !== 'pending'}>Pending</MenuItem>
                                            <MenuItem value="accepted" disabled={order.status !== 'pending'}>Accept</MenuItem>
                                            <MenuItem value="rejected" disabled={order.status !== 'pending'}>Reject</MenuItem>
                                            <MenuItem value="processing" disabled={order.paymentStatus !== 'paid' || (order.status !== 'accepted' && order.status !== 'pending')}>Processing</MenuItem>
                                            <MenuItem value="delivered" disabled={order.status !== 'processing'}>Delivered</MenuItem>
                                            <MenuItem value="cancelled">Cancel</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default OrderManagement; 