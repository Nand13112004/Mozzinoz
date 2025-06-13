import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error(`Failed to update order status to ${status}:`, error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') { // Only fetch orders if user is admin
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">All Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders-message">No orders yet.</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.email || "Guest"}</td>
                  <td>
                    <ul className="order-items-list">
                      {order.items.map((item) => (
                        <li key={item._id || item.name}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status === "pending" && (
                      <>
                        <button onClick={() => updateOrderStatus(order._id, "accepted")} className="action-button accept">Accept</button>
                        <button onClick={() => updateOrderStatus(order._id, "rejected")} className="action-button reject">Reject</button>
                      </>
                    )}
                    {order.status === "accepted" && (
                      <button onClick={() => updateOrderStatus(order._id, "processing")} className="action-button processing">Start Processing</button>
                    )}
                    {order.status === "processing" && (
                      <button onClick={() => updateOrderStatus(order._id, "delivered")} className="action-button delivered">Mark as Delivered</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
