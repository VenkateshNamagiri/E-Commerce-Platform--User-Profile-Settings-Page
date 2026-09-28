import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import ProfilePage from './pages/ProfilePage'
import Login from './pages/Login'
import Register from './pages/Register'

import AdminProducts from './pages/admin/AdminProducts'
import ProductForm from './pages/admin/ProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCoupons from './pages/admin/AdminCoupons'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer (logged in) */}
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute><AdminProducts /></AdminRoute>
          } />
          <Route path="/admin/products/add" element={
            <AdminRoute><ProductForm /></AdminRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <AdminRoute><ProductForm /></AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute><AdminOrders /></AdminRoute>
          } />
          <Route path="/admin/coupons" element={
            <AdminRoute><AdminCoupons /></AdminRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
