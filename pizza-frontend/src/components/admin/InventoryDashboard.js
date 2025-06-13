import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config';

const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [threshold, setThreshold] = useState('');
    const [error, setError] = useState('');
    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchInventory();
        } else if (!authLoading && user?.role !== 'admin') {
            setError('You do not have administrative access to view inventory.');
        }
    }, [authLoading, user]);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                return;
            }
            const response = await axios.get(`${API_BASE_URL}/api/inventory/status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setInventory(response.data);
        } catch (error) {
            console.error("Failed to fetch inventory data:", error);
            setError(error.response?.data?.message || 'Failed to fetch inventory data');
        }
    };

    const handleUpdate = (item) => {
        setSelectedItem(item);
        setQuantity(item.quantity.toString());
        setThreshold(item.threshold.toString());
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                return;
            }
            await axios.put(`${API_BASE_URL}/api/inventory/update`, {
                ingredient: selectedItem.ingredient,
                quantity: parseFloat(quantity),
                threshold: parseFloat(threshold)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOpenDialog(false);
            fetchInventory();
        } catch (error) {
            console.error("Failed to update inventory:", error);
            setError(error.response?.data?.message || 'Failed to update inventory');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Inventory Management</h2>
            {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ingredient</TableCell>
                            <TableCell>Current Quantity</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Threshold</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.ingredient}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.threshold}</TableCell>
                                <TableCell>{new Date(item.lastUpdated).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdate(item)}
                                    >
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Update Inventory</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Threshold"
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default InventoryDashboard; 