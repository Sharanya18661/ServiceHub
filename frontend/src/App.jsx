import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Services } from './pages/Services';
import { ProviderDetail } from './pages/ProviderDetail';

import { CustomerDashboard } from './pages/CustomerDashboard';
import { CustomerRequests } from './pages/CustomerRequests';
import { CustomerBookings } from './pages/CustomerBookings';

import { ProviderDashboard } from './pages/ProviderDashboard';
import { ProviderServices } from './pages/ProviderServices';
import { ProviderRequests } from './pages/ProviderRequests';
import { ProviderJobs } from './pages/ProviderJobs';

import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/providers/:id" element={<ProviderDetail />} />

          {/* Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/requests" element={<CustomerRequests />} />
            <Route path="/customer/bookings" element={<CustomerBookings />} />
          </Route>

          {/* Provider Routes */}
          <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/services" element={<ProviderServices />} />
            <Route path="/provider/requests" element={<ProviderRequests />} />
            <Route path="/provider/jobs" element={<ProviderJobs />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
