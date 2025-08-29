import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import HomeScreen from './(public)/screens/HomeScreen';
import AboutScreen from './(public)/screens/AboutScreen';
import ContactScreen from './(public)/screens/ContactScreen';
import CareerScreen from './(public)/screens/CareerScreen';

import LoginScreen from './(public)/screens/LoginScreen';
import SignupScreen from './(public)/screens/SignupScreen';
import ForgotPasswordScreen from './(public)/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './(public)/screens/ResetPasswordScreen';

import ServiceScreen from './(public)/screens/ServiceScreen';
import ServicePageScreen from './(public)/screens/ServicePageScreen.jsx';
import SolutionsManagementScreen from './(public)/screens/admin/SolutionsManagementScreen';

import PrivateRoute from './(public)/components/PrivateRoute';
import AdminDashboard from './layouts/admin-layout.jsx';
import AdminIndexPage from './(public)/screens/admin/AdminIndexPage.jsx';

import NotificationScreen from './(public)/screens/admin/NotificationScreen';
import ServiceManagementScreen from './(public)/screens/admin/ServiceManagementScreen.jsx';
import CreateNewServiceScreen from './(public)/screens/admin/CreateNewServiceScreen';
import PartnersManagementScreen from './(public)/screens/admin/PartnersManagementScreen';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      
      <Route path="/" element={<App />}>
        <Route index element={<HomeScreen />} />
        <Route path="about-us" element={<AboutScreen />} />
        <Route path="contact" element={<ContactScreen />} />
        <Route path="career" element={<CareerScreen />} />


        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<SignupScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
        <Route path="/services" element={<ServiceScreen />} />
        <Route path="/services/:id" element={<ServicePageScreen />} />

      </Route>

      {/* Admin protected routes */}
      <Route path="" element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminIndexPage />} />
           <Route path="dashboard" element={<AdminIndexPage />} />
           <Route path="notifications" element={<NotificationScreen />} />
           <Route path="services" element={<ServiceManagementScreen />} />
           <Route path="services/create" element={<CreateNewServiceScreen />} />
           <Route path="solutions" element={<SolutionsManagementScreen />} />
           <Route path="partners" element={<PartnersManagementScreen />} />


        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
